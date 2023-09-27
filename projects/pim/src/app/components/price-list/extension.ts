import { FormGroup } from "@angular/forms";
import { PriceListRequest } from "../../models/priceListRequest.model";

export function preparePriceListRequest(formGroup: FormGroup): PriceListRequest {
    return {
      url : formGroup.controls['url'].value,
      userName: formGroup.controls['userName'].value,
      password: formGroup.controls['password'].value,
    }
  }  