import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BannerService } from './services/banner.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PriceListModule } from './components/price-list/price-list.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
   
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
    BrowserAnimationsModule,
    PriceListModule
  ],
  providers: [BannerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
