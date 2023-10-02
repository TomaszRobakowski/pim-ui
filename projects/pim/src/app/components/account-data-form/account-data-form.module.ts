import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDataFormComponent } from './account-data-form.component';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  declarations: [
    AccountDataFormComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    FormsModule, 
    ReactiveFormsModule,
    PasswordModule,
    TabViewModule
  ],
  exports: [
    AccountDataFormComponent
  ]
})
export class AccountDataFormModule { }
