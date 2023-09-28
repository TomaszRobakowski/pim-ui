import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceListComponent } from './price-list.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AccountDataFormModule } from '../account-data-form/account-data-form.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    PriceListComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    TableModule,
    AccountDataFormModule,
    ButtonModule,
    InputTextModule
  ]
})
export class PriceListModule { }
