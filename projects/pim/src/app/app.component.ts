import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { saveAs } from 'file-saver';
import { getBlobResponseMetaData, getTimestamp } from './extensions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceListRequest } from './model/priceListRequest';
import { BannerService } from './services/banner.service';
import { PriceListResponse } from './model/priceListResponse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public storeFormData = false;
  public formGroup: FormGroup | undefined;
  public isLoading = false;
  public isValid = false;
  private currentUrl: string | undefined;
  private request: PriceListRequest | undefined;
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
    const request = this.preparePriceListRequest(this.formGroup);
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
    this.apiService.getPriceList(request).subscribe({
      next: (response: PriceListResponse) => {
        console.log(response);
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

  private preparePriceListRequest(formGroup: FormGroup): PriceListRequest {
    return {
      url : formGroup.controls['url'].value,
      userName: formGroup.controls['userName'].value,
      password: formGroup.controls['password'].value,
    }
  }  
}
