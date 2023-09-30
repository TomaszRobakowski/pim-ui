import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'pim-column-settings',
  templateUrl: './column-settings.component.html',
  styleUrls: ['./column-settings.component.scss']
})
export class ColumnSettingsComponent implements OnInit {
  public sourceColumns: string[] | undefined;
  public targetColumns: string[] = [];

  constructor(private readonly  dynamicDialogRef: DynamicDialogRef,
    private readonly  dynamicDialogConfig: DynamicDialogConfig,){}
  
  public ngOnInit(): void {
    this.sourceColumns = this.dynamicDialogConfig.data.columns;  
    this.targetColumns = this.dynamicDialogConfig.data.target;
  }
    
  public save(): void {
    this.dynamicDialogRef.close(this.targetColumns);
  }
}
