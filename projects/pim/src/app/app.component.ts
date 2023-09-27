import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { saveAs } from 'file-saver';
import { getBlobResponseMetaData, getTimestamp } from './extensions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceListRequest } from './models/priceListRequest.model';
import { BannerService } from './services/banner.service';
import { PriceListResponse } from './models/priceListResponse.model';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { VersionModel } from './models/version.model';
import { combineLatest, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public apiVersion$ = this.apiService.getVersion();
  public version$ = this.httpClient.get<VersionModel>('assets/version/build.json', {responseType: 'json'});
  public version = '';
  public storeFormData = false;
  public formGroup: FormGroup | undefined;
  public isLoading = false;
  public isValid = false;
  public env = environment.production ? '' : ' - local';
  private currentUrl: string | undefined;

  constructor(private readonly apiService: ApiService,
    private readonly formBuilder: FormBuilder,
    private readonly bannerService: BannerService,
    private readonly httpClient: HttpClient
    ){}

  private getVersion() {
    combineLatest([this.apiVersion$, this.version$])
    .pipe(tap(([apiVersion, feVersion]) => {
      this.version = `${apiVersion.version} / ${feVersion.version.major}.${feVersion.version.minor}.${feVersion.release}${this.env} `
    })).subscribe();
    
  }  

  ngOnInit(): void {
    this.currentUrl = `${document.location.protocol}${document.location.hostname}`;
    this.getVersion();

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

  private preparePriceListRequest(formGroup: FormGroup): PriceListRequest {
    return {
      url : formGroup.controls['url'].value,
      userName: formGroup.controls['userName'].value,
      password: formGroup.controls['password'].value,
    }
  }  
}
