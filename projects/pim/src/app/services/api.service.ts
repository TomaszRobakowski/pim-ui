import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PriceListRequest } from '../models/priceListRequest.model';
import { environment } from '../../environments/environment';
import { PriceListResponse } from '../models/priceListResponse.model';
import { PriceListPageRequest } from '../models/priceListPageRequest.model';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private httpClient: HttpClient){}

    public isLoading$ = new BehaviorSubject<boolean>(false);

    public resetLoading() {
        this.isLoading$.next(false);
    }

    public getPriceListFile() {
        this.isLoading$.next(true);
        const httpHeaders = new HttpHeaders()
        .set('Cache-Control', 'no-cache');

        const options = {headers: httpHeaders, responseType: 'blob' as 'json'};

        const request: PriceListRequest = {
            userName: '366636243',
            url: 'cyklo.aspire.cz',
            password: 'ws6903'
        }
        return this.httpClient.post<Blob>(`${environment.apiAddress}/PriceList`, request, options).pipe(
                map(res => {
                    this.isLoading$.next(false);
                    return new Blob([res], { type: 'text/csv', })
                })
        );    
    }

    public getDirectPriceList(request: PriceListRequest) {
    const hash = btoa(`${request.userName}:${request.password}`); 

        this.isLoading$.next(true);
        const httpHeaders = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Cache-Control', 'no-cache')
        .set('Authorization', `Basic ${hash}`)
        //.set('Authorization', 'Basic MzY2NjM2MjQzOndzNjkwMw==')
        .set('Access-Control-Allow-Headers', 'Content-Type')
        .set('Access-Control-Allow-Methods', 'GET')
        .set('Access-Control-Allow-Origin', '*');
        const options = {headers: httpHeaders};

        return this.httpClient.get<PriceListResponse>(`https://${request.url}/api/v2/products`, options);
    }

    public getPriceListByPage(request: PriceListPageRequest) {
        this.isLoading$.next(true);
        const httpHeaders = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Cache-Control', 'no-cache');

        const options = {headers: httpHeaders};

        return this.httpClient.post<PriceListResponse>(`${environment.apiAddress}/PriceList/page`, request, options);
    }


    public getPriceList(request: PriceListRequest) {
        this.isLoading$.next(true);
        const httpHeaders = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Cache-Control', 'no-cache');

        const options = {headers: httpHeaders};

        return this.httpClient.post<PriceListResponse>(`${environment.apiAddress}/PriceList/all`, request, options);
    }

    public getVersion() : Observable<any> {
        const httpHeaders = new HttpHeaders()
        .set('Content-Type', 'text/plain')
        .set('Cache-Control', 'no-cache');

        const options = {headers: httpHeaders};

        return this.httpClient.get<any>(`${environment.apiAddress}/PriceList/version`, options);
    }

}