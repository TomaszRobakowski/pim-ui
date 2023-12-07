import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PriceListRequest } from '../../models/priceListRequest.model';
import { BannerService } from '../../services/banner.service';
import { PriceListResponse } from '../../models/priceListResponse.model';
import { Product } from '../../models/priceList.model';
import { Field } from '../../models/field.model';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ColumnSettingsComponent } from '../settings/column-settings/column-settings.component';
import { PriceListPageRequest } from '../../models/priceListPageRequest.model';
import { SearchQuery } from '../../models/search.model';
import { SelectOption } from '../../models/select-option';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'pim-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss'],
  providers: [DialogService]
})
export class PriceListComponent  implements OnInit, AfterViewChecked {

  public isLoading = false;
  public isValid = false;
  public products: Product[] = [];
  public selectedProducts: Product[] = [];
  public tableColumns: Field[] = [];
  public storeFormData = false;
  public currentPage = 0;
  public isTableVisible = false;
  public isLastPage = false;
  public pageSize = 0;
  public totalCount = 0;
  public brands: SelectOption[] = [];
  public selectedBrand: SelectOption | undefined = {name: '', code: ''};
  public searchQuery: SearchQuery = { barcode: '', nameShort: '', brandName: ''};
  public searchByColumn: string[] = ['nameShort','barcode'];
  private currentUrl: string | undefined;
  private dialog: DynamicDialogRef | undefined;

  constructor(private readonly apiService: ApiService,
      private readonly bannerService: BannerService,
      private readonly dialogService: DialogService,
      private readonly fileService: FileService
    ){}
  
 /*
 TODO: zmienic wyszukiwanie
 przerobienie na contains
 pobieranie csvki zgodnie z parametrami filtrowania
 refresh danych w bazie + część backend + historia refreshów
 kasowanie zaznaczeń na życzenie i po downloadzie
 */

  public ngAfterViewChecked(): void {
    this.setupSearchInputs();
  }

  public ngOnInit(): void {
    if (this.products.length === 0){
      this.pageChange('first');
    }
    
    this.onIsLoadingChange();
    this.getDictionaries();
    this.setupSearchInputs();
  }
  
  public pageChange(page: string): void {
    const request : PriceListPageRequest = {pageSize: 100, continuationToken: {}, search: this.searchQuery /*this.getSearchQuery()*/}
    switch (page) {
      case 'next':
        this.currentPage++;
        break;
      case 'previous':
        this.currentPage--;
        break;
      default :
      this.currentPage = 0;
    }    

    request.pageNumber = this.currentPage;

    this.onPrepareListByPage(request)
  }

  public columnSettings(): void {
    this.dialog = this.dialogService.open(ColumnSettingsComponent, this.getDynamicDialogConfig());
    this.dialog.onClose.subscribe((response) => this.actionAfterCloseSettings(response));
  }

  onCheckboxToggle() {
     console.log(this.selectedProducts)
  }

  public clear(table: Table) {
    table.clear();
  }
  
  public applyFilterGlobal(table: Table, $event : any, stringVal: string) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  public applyFilter( $event : any, fieldName: string) {
    switch (fieldName) {
      case 'nameShort':
        this.searchQuery.nameShort = ($event.target as HTMLInputElement).value;
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
    this.currentPage = 0;
    this.onPrepareListByPage(request)
  }

  public clearChecked() {
    this.selectedProducts = [];
  }

  public clearSearch(fieldName: string): void {
    switch (fieldName) {
      case 'nameShort':
        this.searchQuery.nameShort = '';
        break
      case 'barcode':
        this.searchQuery.barcode = '';
        break
      default:
        return;
    }
    this.search();
  }

  public onPrepareList(request: PriceListRequest): void {
    this.isTableVisible = false;
    this.tableColumns = this.getTableColumns();

    this.apiService.getPriceList(request).subscribe({
      next: (response: PriceListResponse) => {
        this.products = response.products;
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
        this.isLastPage = response.isLastPage;
        this.totalCount = response.totalCount;
        this.pageSize = request.pageSize ? request.pageSize : 0;
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
    this.fileService.getFullPriceList();
  }

  public saveSelectedAsCsv(): void {
    const ids = this.selectedProducts.map(product => product.id);
    this.fileService.getPriceListByProductId(ids);
  }

  public showSelectedProducts(): void {
    
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

  private onIsLoadingChange(){
    this.apiService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  private getDictionaries(): void {
    this.apiService.getBrandNameDictionary()
    .subscribe(response =>  {
      response?.data ? this.brands = response.data.map(brand => ({name: !!brand ? brand : '-- remove slection --' , code:brand})) : [];
    });
  }

  private setupSearchInputs(): void {
    this.searchByColumn.forEach(column => {
      const valueIndex = Object.keys(this.searchQuery).indexOf(column);
      const value = Object.values(this.searchQuery)[valueIndex];
        const input = document.getElementById(`search-${column}`);
        if (input){
          (input as HTMLInputElement).value = value.trim()
        }
    })
  }
}
