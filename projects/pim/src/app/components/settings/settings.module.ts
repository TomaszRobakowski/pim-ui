import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnSettingsComponent } from './column-settings/column-settings.component';
import { PickListModule } from 'primeng/picklist';



@NgModule({
  declarations: [
    ColumnSettingsComponent
  ],
  imports: [
    CommonModule,
    PickListModule
  ],
  exports: [
    ColumnSettingsComponent
  ]
})
export class SettingsModule { }
