import { Injectable, Inject } from '@angular/core';
// tslint:disable-next-line:import-blacklist

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    @Inject('LOCALSTORAGE') private localStorage: any,
    private router: Router
  ) {}
  nagivageTo(url: string): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.router.navigate([url]);
  }
}
