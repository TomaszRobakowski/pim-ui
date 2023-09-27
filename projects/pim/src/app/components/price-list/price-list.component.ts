import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { saveAs } from 'file-saver';
import { getBlobResponseMetaData, getTimestamp } from '../../extensions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceListRequest } from '../../models/priceListRequest.model';
import { BannerService } from '../../services/banner.service';
import { PriceListResponse } from '../../models/priceListResponse.model';
import { environment } from '../../../environments/environment';
import { preparePriceListRequest } from '../../components/price-list/extension';
import { Product } from '../../models/priceList.model';
import { Field } from '../../models/field.model';

@Component({
  selector: 'pim-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent {
  public storeFormData = false;
  public formGroup: FormGroup | undefined;
  public isLoading = false;
  public isValid = false;
  public env = environment.production ? '' : ' - local';

  products: Product[] = [];
  cols: Field[] = [];

  private currentUrl: string | undefined;

  constructor(private readonly apiService: ApiService,
    private readonly formBuilder: FormBuilder,
    private readonly bannerService: BannerService,
    ){}

  

  ngOnInit(): void {
    this.currentUrl = `${document.location.protocol}${document.location.hostname}`;

    this.apiService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (!isLoading) {
        this.formInit();
      }
    });
  }

  public onClick(action: string) {
    if (!this.formGroup?.valid) {
      return;
    }
    const request = preparePriceListRequest(this.formGroup);
    this.saveFormData(request);

    switch (action) { 
      case 'csv': 
        this.onGetCsv(request);
      break;
      case 'list':
        this.onPrepareList(request);
      break;
      default: 
      return;
    }
  }

  public onPrepareList(request: PriceListRequest): void {
    this.cols = [
      { field: 'nameFull', header: 'nameFull' },
      { field: 'nameShort', header: 'nameShort' },
      { field: 'productId', header: 'productId' },
      { field: 'stockId', header: 'stockId' },
    ];
    this.apiService.getPriceList(request).subscribe({
      next: (response: PriceListResponse) => {
        console.log(response);
        this.products = response.products;
        this.apiService.resetLoading();
      },
      error: (e) => {
        this.apiService.resetLoading();
        const message = e?.message ?? 'Unexpected error';
        this.bannerService.error(`${message}, Error`);
      },
      complete: () => {}
    }
    )
  }

  public onGetCsv(request: PriceListRequest): void {
    this.apiService.getPriceListFile(request).subscribe({
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
    })
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

  
}
