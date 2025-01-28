import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TecDocCatsService {

  public messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();
  private currentCarModName;
  constructor() { }

  changeMessage(message: number) {
    this.messageSource.next(message);
  }
  setCarModification(val) {
    this.currentCarModName = val;
}

getCarModification() {
    return this.currentCarModName ;
}
}
