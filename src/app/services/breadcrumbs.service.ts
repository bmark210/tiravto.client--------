import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Breadcrumbs } from '../core/interfaces/breadcrumbs';

@Injectable()
export class BreadcrumbsService {
  public breadcrumbsStatusSource = new BehaviorSubject<Breadcrumbs>(null);
  breadcrumbsStatus$ = this.breadcrumbsStatusSource.asObservable();

  public breadcrumbsFinalStatusSource = new BehaviorSubject<[Breadcrumbs, boolean]>(null);
  breadcrumbsFinalStatus$ = this.breadcrumbsFinalStatusSource.asObservable();

  public breadcrumbCategoryStatusSource = new BehaviorSubject<Breadcrumbs>(null);
  breadcrumbsCategoryStatus$ = this.breadcrumbCategoryStatusSource.asObservable();

  constructor(
  ) {
  }


  getCategoryUrlByStringKey(stringKey: string): string {
    let url = '/products';
    url += '?category=' + encodeURIComponent('' + stringKey);
    url += '&page=1&minprice=0&maxprice=0&take=20&orderby=0';
    return url;
  }
}
