import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { saveAs } from 'file-saver';
import { getBlobResponseMetaData, getTimestamp } from './extensions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceListRequest } from './model/priceListRequest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pim';
  
  public formGroup: FormGroup | undefined;
  public isLoading = false;
  public isValid = false;
  constructor(private readonly apiService: ApiService,
    private readonly formBuilder: FormBuilder,){}

  ngOnInit(): void {
    this.apiService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if (!isLoading) {
        this.formInit();
      }
    });
  }

  onClick(){
    if (!this.formGroup?.valid) {
      return;
    }
    const request: PriceListRequest = {
      url : this.formGroup.controls['url'].value,
      userName: this.formGroup.controls['userName'].value,
      password: this.formGroup.controls['password'].value,
    }
    this.apiService.getPriceList(request).subscribe(
      (response: Blob) => {
        const [responseType, extension] = getBlobResponseMetaData(response);
        const fileName =  `PriceList_${getTimestamp()}.${extension}`
        const file = new File([response], fileName, { type: 'text/csv' });
        saveAs(file);
      },
    )
  }

  private formInit() : void {
    this.formGroup = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      url: [null, [Validators.required]]
    })
  }

}
