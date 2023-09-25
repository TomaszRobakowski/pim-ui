import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class BannerService {
    constructor(private readonly toastr: ToastrService) {}

    public error(message: string, title?: string, dismissByTap = true): void {
        this.toastr.error(message, title, {
           tapToDismiss: dismissByTap,
           disableTimeOut: dismissByTap,
           timeOut: 5000,
           enableHtml: true,
           onActivateTick: true
        });
     }

     public info(message: string, title?: string): void {
        this.toastr.info(message, title, {
           onActivateTick: true
        });
     }

     public warning(message: string, title?: string): void {
        this.toastr.warning(message, title, {
           onActivateTick: true
        });
     }

     public success(message: string, title?: string): void {
        this.toastr.success(message, title, {
           onActivateTick: true
        });
     }
}
