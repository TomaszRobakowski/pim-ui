import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pim-account-data-form',
  templateUrl: './account-data-form.component.html',
  styleUrls: ['./account-data-form.component.scss']
})
export class AccountDataFormComponent {
@Input() formGroup: FormGroup | undefined;
@Input() isHide = false;
@Output() click = new EventEmitter<string>();
@Output() storeForm = new EventEmitter<boolean>();

public storeFormData = false;

public onClick(action: string) {
  this.click.emit(action);
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
