import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceListComponent } from './price-list.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AccountDataFormModule } from '../account-data-form/account-data-form.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SettingsModule } from '../settings/settings.module';
import { PaginatorComponent } from '../paginator/paginator.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PriceListComponent,
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    TableModule,
    DropdownModule,
    AccountDataFormModule,
    ButtonModule,
    InputTextModule,
    SettingsModule,
    FormsModule
  ]
})
export class PriceListModule { }
