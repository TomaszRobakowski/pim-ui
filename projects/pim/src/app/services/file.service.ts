import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { getBlobResponseMetaData, getTimestamp } from '../extensions/fileExtensions';
import * as saveAs from 'file-saver';
import { BannerService } from './banner.service';

@Injectable()
export class FileService {
    constructor(private readonly apiService: ApiService,
        private readonly bannerService: BannerService) {}

    public getFullPriceList(): void {
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

    public getPriceListByProductId(ids: (string | null)[]): void {
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

}
