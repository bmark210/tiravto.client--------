import { ChipValue } from './../models/Filter';
import { Injectable} from '@angular/core';
import {BehaviorSubject } from 'rxjs';


@Injectable()
export class FilterService {
  public resetFilterStatusSource = new BehaviorSubject<boolean>(false);
  resetFilterStatus$ = this.resetFilterStatusSource.asObservable();

  public countButtonStatusSource = new BehaviorSubject<boolean>(false);
  countButtonStatus$ = this.countButtonStatusSource.asObservable();

  public changeChipStatusSource = new BehaviorSubject<ChipValue>(null);
  changeChipStatus$ = this.changeChipStatusSource.asObservable();

  public searchStatusSource = new BehaviorSubject<boolean>(false);
  searchStatusStatus$ = this.searchStatusSource.asObservable();

    constructor() {
    }
}
