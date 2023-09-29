import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'projects/pim/src/environments/environment';

@Component({
  selector: 'pim-account-data-form',
  templateUrl: './account-data-form.component.html',
  styleUrls: ['./account-data-form.component.scss']
})
export class AccountDataFormComponent {
@Input() formGroup: FormGroup | undefined;
@Input() isHide = false;
@Output() action = new EventEmitter<string>();
@Output() storeForm = new EventEmitter<boolean>();

public storeFormData = false;
public isProduction = environment.production;

public onClick(action: string) {
  this.action.emit(action);
}

public hide(): void {
  this.isHide = true;
}

public show(): void {
  this.isHide = false;
}

public onStoreModelChange() {
  this.storeForm.emit(this.storeFormData);
}
}
