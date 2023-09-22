import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private httpClient: HttpClient){}

    public getPriceList() {
        const httpHeaders = new HttpHeaders()
        .set('Content-Type', 'text/csv')
        .set('Cache-Control', 'no-cache');

        //const baseUrl = 'https://localhost:44309/';
        const baseUrl = 'https://webapp-230922040343.azurewebsites.net/';
        return this.httpClient.get(`${baseUrl}PriceList`, { responseType: 'blob'}).pipe(
            map(res => {
                return new Blob([res], { type: 'text/csv', })})
        );    
    }

}