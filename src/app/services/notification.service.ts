import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
  public messageCountStatusSource = new BehaviorSubject<number>(0);
  messageCountStatus$ = this.messageCountStatusSource.asObservable();

  constructor(private toastr: ToastrService) {}

  private timeOut = 5000;
  private closeButton = true;
  private progressBar = true;
  private positionClass = 'toast-bottom-left';
  private preventDuplicates = true;
  private config = {
    timeOut: this.timeOut,
    closeButton: this.closeButton,
    progressBar: this.progressBar,
    positionClass: this.positionClass,
    preventDuplicates: this.preventDuplicates
  };

  public success(message: string, title: string, userConfig: any = null) {
    const conf = userConfig ? userConfig : this.config;
    this.toastr.success(message, title, conf);
  }
  public error(message: string, title: string, userConfig: any = null) {
    const conf = userConfig ? userConfig : this.config;
    this.toastr.error(message, title, conf);
  }
  public warning(message: string, title: string, userConfig: any = null) {
    const conf = userConfig ? userConfig : this.config;
    this.toastr.warning(message, title, conf);
  }
  public info(message: string, title: string, userConfig: any = null) {
    const conf = userConfig ? userConfig : this.config;
    this.toastr.info(message, title, conf);
  }
}
