import { Component, OnInit } from '@angular/core';
import { VersionModel } from './models/version.model';
import { ApiService } from './services/api.service';
import { HttpClient } from '@angular/common/http';
import { combineLatest, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private readonly apiService: ApiService,
    private readonly httpClient: HttpClient,
    ){}

  public apiVersion$ = this.apiService.getVersion();
  public version$ = this.httpClient.get<VersionModel>('assets/version/build.json', {responseType: 'json'});
  public version = '';
  public env = environment.production ? '' : ' - local';
  
  ngOnInit(): void {
    this.getVersion();
  }

  private getVersion() {
    combineLatest([this.apiVersion$, this.version$])
    .pipe(tap(([apiVersion, feVersion]) => {
      this.version = `${apiVersion.version} / ${feVersion.version.major}.${feVersion.version.minor}.${feVersion.release}${this.env} `
    })).subscribe();
  }  
}

