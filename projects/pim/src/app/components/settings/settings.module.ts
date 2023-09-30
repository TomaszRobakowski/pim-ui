import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnSettingsComponent } from './column-settings/column-settings.component';
import { PickListModule } from 'primeng/picklist';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    ColumnSettingsComponent
  ],
  imports: [
    CommonModule,
    PickListModule,
    ButtonModule
  ],
  exports: [
    ColumnSettingsComponent
  ]
})
export class SettingsModule { }
