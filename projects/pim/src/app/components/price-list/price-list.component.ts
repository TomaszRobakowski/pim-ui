import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { saveAs } from 'file-saver';
import { getBlobResponseMetaData, getTimestamp } from '../../extensions/fileExtensions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceListRequest } from '../../models/priceListRequest.model';
import { BannerService } from '../../services/banner.service';
import { PriceListResponse } from '../../models/priceListResponse.model';
import { Product } from '../../models/priceList.model';
import { Field } from '../../models/field.model';
import { Table } from 'primeng/table';
import { preparePriceListRequest } from '../../extensions/preparePriceListRequest';
import { saveDataArrayToFile } from '../../extensions/saveDataArrayToFile';
import { getMockProducts } from './price-list.mock';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ColumnSettingsComponent } from '../settings/column-settings/column-settings.component';
import { PriceListPageRequest, TableContinuationToken } from '../../models/priceListPageRequest.model';
import { SearchQuery } from '../../models/search.model';
import { SelectOption } from '../../models/select-option';

@Component({
  selector: 'pim-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss'],
  providers: [DialogService]
})
export class PriceListComponent {

  public formGroup: FormGroup | undefined;
  public isLoading = false;
  public isValid = false;
  public products: Product[] = [];
  public selectedProducts: Product[] = [];
  public tableColumns: Field[] = [];
  public storeFormData = false;
  public isAccountDataFormHidden = true;
  public tableContinuationTokens: string[] = ['{}'];
  public currentTokenIndex = 0;
  public isTableVisible = false;
  public isLastPage = false;
  public pageSize = 0;
  public totalCount = 0;
  public brands: SelectOption[] = [];
  public selectedBrand: SelectOption | undefined = {name: '', code: ''};
  public searchQuery: SearchQuery = { barcode: '', shortName: '', brandName: ''};
  private currentUrl: string | undefined;
  private dialog: DynamicDialogRef | undefined;

  constructor(private readonly apiService: ApiService,
    private readonly formBuilder: FormBuilder,
    private readonly bannerService: BannerService,
    public dialogService: DialogService
    ){}


 /*
 TODO: zmienic wyszukiwanie
 przerobienie na contains
 pobieranie csvki zgodnie z parametrami filtrowania
 refresh danych w bazie + część backend + historia refreshów
 kasowanie zaznaczeń na życzenie i po downloadzie
 */  

  ngOnInit(): void {
    if (this.products.length === 0){
      this.pageChange('first');
    }
    
    //this.currentUrl = `${document.location.protocol}${document.location.hostname}`;

    this.onIsLoadingChange();
    this.getDictionaries();
  }

  
  pageChange(page: string) {
    const request : PriceListPageRequest = {pageSize: 100, continuationToken: {}, search: this.searchQuery /*this.getSearchQuery()*/}
    switch (page) {
      case 'next':
        this.currentTokenIndex++;
        break;
      case 'previous':
        this.currentTokenIndex--;
        break;
      default :
      this.currentTokenIndex = 0;
    }    

    request.continuationToken = this.getTokenByIndex(this.currentTokenIndex);
    request.pageNumber = this.currentTokenIndex;

    this.onPrepareListByPage(request)
  }

  public columnSettings(): void {
    this.dialog = this.dialogService.open(ColumnSettingsComponent, this.getDynamicDialogConfig());
    this.dialog.onClose.subscribe((response) => this.actionAfterCloseSettings(response));
  }

  public onClick(action: string) {
    if (!this.formGroup?.valid) {
      return;
    }

    const request = preparePriceListRequest(this.formGroup);
    this.saveFormData(request);
    switch (action) { 
      case 'csv': 
        this.onGetCsv();
      break;
      case 'list':
        this.onPrepareList(request);
      break;
      case 'direct':
        this.onGetDirectList(request);
      break;
      case 'test':
        this.tableColumns = this.getTableColumns();
        this.products = getMockProducts();
        this.isTableVisible = true;
      break;
      default: 
      return;
    }
  }

  onCheckboxToggle() {
     console.log(this.selectedProducts)
  }

  public saveAllAsCsv(): void {
    saveDataArrayToFile(this.products);
  }

  public clear(table: Table) {
    table.clear();
  }
  
  public applyFilterGlobal(table: Table, $event : any, stringVal: string) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  public applyFilter( $event : any, fieldName: string) {
    switch (fieldName) {
      case 'shortName':
        this.searchQuery.shortName = ($event.target as HTMLInputElement).value;
        return;
      case 'barcode':
        this.searchQuery.barcode = ($event.target as HTMLInputElement).value;
        return;
      default:
        return;
    }
  }

  public searchByBrand() {
    this.searchQuery.brandName = this.selectedBrand?.code;
    this.selectedBrand = !this.selectedBrand?.code ? undefined : this.selectedBrand
    this.search();
  }

  public search(): void {
    const request : PriceListPageRequest = {
      pageSize: 100,
      pageNumber: 0, 
      continuationToken: {},
      search: this.searchQuery, 
      };
    this.tableContinuationTokens = ['{}'];
    this.currentTokenIndex = 0;
    this.onPrepareListByPage(request)
  }

  public clearChecked() {
    this.selectedProducts = [];
  }

  public clearSearch(fieldName: string): void {
    switch (fieldName) {
      case 'shortName':
        this.searchQuery.shortName = '';
        break
      case 'barcode':
        this.searchQuery.barcode = '';
        break
      default:
        return;
    }
    this.search();
  }

  public onGetDirectList(request: PriceListRequest): void {
    this.isTableVisible = false;
    this.tableColumns = this.getTableColumns();

    this.apiService.getDirectPriceList(request).subscribe({
      next: (response: PriceListResponse) => {
        this.products = response.products;
        this.showAccountDataFrom();
        this.isTableVisible = true;
        this.apiService.resetLoading();
      },
      error: (e) => {
        this.apiService.resetLoading();
        const message = e?.message ?? 'Unexpected error';
        this.bannerService.error(`${message}, Error`);
      },
      complete: () => {}
    });
  }

  public onPrepareList(request: PriceListRequest): void {
    this.isTableVisible = false;
    this.tableColumns = this.getTableColumns();

    this.apiService.getPriceList(request).subscribe({
      next: (response: PriceListResponse) => {
        this.products = response.products;
        this.showAccountDataFrom();
        this.isTableVisible = true;
        this.apiService.resetLoading();
      },
      error: (e) => {
        this.apiService.resetLoading();
        const message = e?.message ?? 'Unexpected error';
        this.bannerService.error(`${message}, Error`);
      },
      complete: () => {}
    });
  }

  public onPrepareListByPage(request: PriceListPageRequest): void {
    this.isTableVisible = false;
    this.tableColumns = this.getTableColumns();

    this.apiService.getPriceListByPage(request).subscribe({
      next: (response: PriceListResponse) => {
        this.products = response.products;
        this.updateContinuationToken(response.continuationToken);
        this.isLastPage = response.isLastPage;
        this.totalCount = response.totalCount;
        this.pageSize = request.pageSize ? request.pageSize : 0;
        this.showAccountDataFrom();
        this.isTableVisible = true;
        this.apiService.resetLoading();
      },
      error: (e) => {
        this.apiService.resetLoading();
        const message = e?.message ?? 'Unexpected error';
        this.bannerService.error(`${message}, Error`);
      },
      complete: () => {}
    });
  }

  public onGetCsv(): void {
    this.apiService.getPriceListFile().subscribe({
      next: (response: Blob) => {
        const [responseType, extension] = getBlobResponseMetaData(response);
        const fileName =  `PriceList_${getTimestamp()}.${extension}`
        const file = new File([response], fileName, { type: 'text/csv' });
        saveAs(file);
      },
      error: (e) => {
        this.apiService.resetLoading();
        const message = e?.message ?? 'Unexpected error';
        this.bannerService.error(`${message}, Error`);
      },
      complete: () => {}
    });
  }

  public saveSelectedAsCsv(): void {
    const ids = this.selectedProducts.map(product => product.id);
    if (ids){
      this.apiService.getCsvForSelectedProducts(ids).subscribe({
        next: (response: Blob) => {
          const [responseType, extension] = getBlobResponseMetaData(response);
          const fileName =  `PriceList_${getTimestamp()}.${extension}`
          const file = new File([response], fileName, { type: 'text/csv' });
          saveAs(file);
        },
        error: (e) => {
          this.apiService.resetLoading();
          const message = e?.message ?? 'Unexpected error';
          this.bannerService.error(`${message}, Error`);
        },
        complete: () => {}
      });
    }
  }

  public onStoreFormChange(storeFormData: boolean) : void {
    this.storeFormData = storeFormData
  }

  private formInit(): void {
    const storeData = localStorage.getItem(`${this.currentUrl}`);
    const formData: PriceListRequest | null = storeData ? JSON.parse(storeData) : null ;

    this.formGroup = this.formBuilder.group({
      userName: [formData?.userName, [Validators.required]],
      password: [formData?.password, [Validators.required]],
      url: [formData?.url, [Validators.required]]
    })
  }

  private saveFormData(request: PriceListRequest): void {
    if (this.storeFormData) {
      localStorage.setItem(`${this.currentUrl}`, JSON.stringify(request));
    }
  }
  
  private showAccountDataFrom() {
    this.isAccountDataFormHidden = true;
  }

  private getTableColumns(): Field[]{
    const storedColumns = localStorage.getItem(`${this.currentUrl}.columns`);
    if (storedColumns)
      return JSON.parse(storedColumns);

    return [
      { field: 'nameFull', header: 'nameFull' },
      { field: 'nameShort', header: 'nameShort' },
      { field: 'productId', header: 'productId' },
      { field: 'stockId', header: 'stockId' },
      { field: 'priceResaleInclVat', header: 'priceResaleInclVat'}
    ];
  };

  private getColumnNameByData(product: Product): string[] {
    const result: string[] = []
    Object.entries(product).forEach(([key, value]) => {
      result.push(`${key}`)
    });
    return result;
  }

  private getDynamicDialogConfig(): DynamicDialogConfig {
    const targetColumns = this.tableColumns.map(column => column.field);
    return       { 
      header: 'Column configuration',
      data: {
        columns: this.getColumnNameByData(this.products[0]).filter(column => !targetColumns.includes(column)),
        target: targetColumns
      },
    }
  }

  private actionAfterCloseSettings(response: string[]) {
    const columns: Field[] = [];
    response.forEach(name => columns.push({ field: `${name}`, header: `${name}`}));
    this.tableColumns = columns;

    localStorage.setItem(`${this.currentUrl}.columns`, JSON.stringify(columns));
  }

  private updateContinuationToken(continuationToken: TableContinuationToken) {
    if (continuationToken === null) {
      this.isLastPage = true;
      return;
    }
    this.isLastPage = false;
    const serializedToken = JSON.stringify(continuationToken)
    const index = this.tableContinuationTokens.indexOf(serializedToken);
    if (index < 0 ) {
      this.tableContinuationTokens.push(serializedToken);
    }
  }

  private getTokenByIndex(currentTokenIndex: number): TableContinuationToken {
    const token = this.tableContinuationTokens[currentTokenIndex]
    return !!token ? JSON.parse(token) : {}
  }

  private onIsLoadingChange(){
    this.apiService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (!isLoading) {
        this.formInit();
      }
    });
  }

  private getDictionaries(): void {
    this.apiService.getBrandNameDictionary()
    .subscribe(response =>  {
      response?.data ? this.brands = response.data.map(brand => ({name: !!brand ? brand : '-- remove slection --' , code:brand})) : [];
    });
  }
}
