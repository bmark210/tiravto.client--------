import { inject, Injectable } from '@angular/core';
import { Client, MenuSectionResponse, SettingActiveResponse } from '../../../../api/client';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderService {
  private client: Client = inject(Client);




  // initBalance(): void {
  //   if (this.authService.isAuthenticated()) {
  //     this.client.account_UserBalance()
  //     .subscribe(data => {
  //       this.balanceStatusSource.next(data);
  //     }, error => { console.error(error); });

  //     this.client.basket_BasketCount().subscribe(data => {
  //       this.basketStoreStatusSource.next(data);
  //     }, error => { console.error(error); });
  //   }
  // }


  checkActiveSettings(): Observable<SettingActiveResponse> {
    return this.client.setting_GetCommonBool()
  }

  getMenus(): Observable<MenuSectionResponse> {
    return this.client.menu_GetMainSection();
  }
}
