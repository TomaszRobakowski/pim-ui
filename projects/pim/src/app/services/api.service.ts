import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { PriceListRequest } from '../model/priceListRequest';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private httpClient: HttpClient){}

    public isLoading$ = new BehaviorSubject<boolean>(false);

    public resetLoading() {
        this.isLoading$.next(false);
    }

    public getPriceList(request: PriceListRequest) {
        this.isLoading$.next(true);
        const httpHeaders = new HttpHeaders()
        .set('Cache-Control', 'no-cache');

        const options = {headers: httpHeaders, responseType: 'blob' as 'json'};

        return this.httpClient.post<Blob>(`${environment.apiAddress}/PriceList`, request, options).pipe(
                map(res => {
                    this.isLoading$.next(false);
                    return new Blob([res], { type: 'text/csv', })
                })
        );    
    }

}