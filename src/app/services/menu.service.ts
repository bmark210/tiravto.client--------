import { BaseHttpService } from './http/base-http.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { AuthService } from './authentication/auth.service.service';
import { CategoryResponse, BasketCountResponse, CategoryProductRequest, Client, FilterRequest, PaginatorResponse, SettingActiveResponse, SettingsResponse } from '../../api/client';
import { ProductModal } from '../core/interfaces/product-modal';

@Injectable()
export class MenuService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public sideNavStatusSource = new BehaviorSubject<boolean>(false);
  sideNavStatus$ = this.sideNavStatusSource.asObservable();

  public screenTypeStatusSource = new BehaviorSubject<number>(0);
  screenTypeStatus$ = this.screenTypeStatusSource.asObservable();

  public partnerTypeStatusSource = new BehaviorSubject<number>(0);
  partnerTypeStatus$ = this.partnerTypeStatusSource.asObservable();

  public homeStatusSource = new BehaviorSubject<boolean>(false);
  homeStatus$ = this.homeStatusSource.asObservable();

  public gridTypeStatusSource = new BehaviorSubject<number>(0);
  gridTypeStatus$ = this.gridTypeStatusSource.asObservable();

  public paginatorStatusSource = new BehaviorSubject<PaginatorResponse>(null);
  paginatorStatus$ = this.paginatorStatusSource.asObservable();

  public spinnerStatusSource = new BehaviorSubject<boolean>(true);
  spinnerStatus$ = this.spinnerStatusSource.asObservable();

  public reInitPriceStatusSource = new BehaviorSubject<boolean>(false);
  reInitStatus$ = this.reInitPriceStatusSource.asObservable();

  public modalContactStatusSource = new BehaviorSubject<boolean>(false);
  modalContactStatus$ = this.modalContactStatusSource.asObservable();

  public ng5SliderStatusSource = new BehaviorSubject<boolean>(false);
  ng5SliderStatus$ = this.ng5SliderStatusSource.asObservable();

  public priceOnlineStatusSource = new BehaviorSubject<boolean>(false);
  priceOnlineStatus$ = this.priceOnlineStatusSource.asObservable();

  public orderSelectStatusSource = new BehaviorSubject<boolean>(false);
  orderSelectStatus$ = this.orderSelectStatusSource.asObservable();

  public myOrderSelectStatusSource = new BehaviorSubject<boolean>(false);
  myOrderSelectatus$ = this.myOrderSelectStatusSource.asObservable();

  public settingBoolStatusSource = new BehaviorSubject<SettingActiveResponse>(null);
  settingBoolStatus$ = this.settingBoolStatusSource.asObservable();

  public balanceStatusSource = new BehaviorSubject<number>(0);
  balanceStatus$ = this.balanceStatusSource.asObservable();

  public categoryWidthSource = new BehaviorSubject<number>(null);
  categoryWidthStatus$ = this.categoryWidthSource.asObservable();

  public productWidthSource = new BehaviorSubject<number>(null);
  productWidthStatus$ = this.productWidthSource.asObservable();

  public columnStatusSource = new BehaviorSubject<number>(0);
  columnStatus$ = this.columnStatusSource.asObservable();

  public menuIntensifiesSource = new BehaviorSubject<number>(null);
  menuIntensifiesStatus$ = this.menuIntensifiesSource.asObservable();

  public priceOnlineSearchSource = new BehaviorSubject<string>(null);
  priceOnlineSearchStatus$ = this.priceOnlineSearchSource.asObservable();

  public saleCategoryIdChangeSource = new BehaviorSubject<string>(null);
  saleCategoryIdChangeStatus$ = this.saleCategoryIdChangeSource.asObservable();

  public filterHelperInitSource = new BehaviorSubject<CategoryProductRequest>(null);
  filterHelperInitStatus$ = this.filterHelperInitSource.asObservable();

  public ng5SliderValuesSource = new BehaviorSubject<[number, number, number, number]>(null);
  ng5SliderValueStatus$ = this.ng5SliderValuesSource.asObservable();

  public changeCategorySource = new BehaviorSubject<CategoryResponse>(null);
  changeCategoryStatus$ = this.changeCategorySource.asObservable();

  public changeSaleFinal = new BehaviorSubject<[CategoryResponse, CategoryProductRequest]>(null);
  changeSaleFinalStatus$ = this.changeSaleFinal.asObservable();

  public settingsReadySource = new BehaviorSubject<boolean>(false);
  settingsReadyStatus$ = this.settingsReadySource.asObservable();

  public categoryReadySource = new BehaviorSubject<CategoryResponse[]>(null);
  categoryReadyStatus$ = this.categoryReadySource.asObservable();

  public resetProductFilterState = new Subject<void>();
  resetProductFilterStateStatus$ = this.resetProductFilterState.asObservable();

  public productModalStatusSource = new BehaviorSubject<ProductModal>(null);
  productModalStatus$ = this.productModalStatusSource.asObservable();

  public categoryBtnSource = new BehaviorSubject<boolean>(null);
  categoryBtnSourceStatus$ = this.categoryBtnSource.asObservable();

  public removeBasketItemSource = new BehaviorSubject<boolean>(null);
  removeBasketItemSourceStatus$ = this.removeBasketItemSource.asObservable();

  public wishlistBasketItemSource = new BehaviorSubject<boolean>(null);
  wishlistBasketItemSourceStatus$ = this.wishlistBasketItemSource.asObservable();

  public basketClickSource = new BehaviorSubject<boolean>(null);
  basketClickSourceStatus$ = this.basketClickSource.asObservable();

  public basketStoreStatusSource = new BehaviorSubject<BasketCountResponse>(null);
  basketStoreStatus$ = this.basketStoreStatusSource.asObservable();

  productModalShow = true;

  menuIntensifies = 0;

  screenType = 0;

  siteSettings: SettingsResponse;
  settingBool: SettingActiveResponse;

  saleFilter: FilterRequest;

  partnerBorder = 0;

  saleMainStringKey = '';

  constructor(
    public baseHttpService: BaseHttpService,
    private client: Client,
    private authService: AuthService
  ) {
  }

  initBalance(): void {
    if (this.authService.isAuthenticated()) {
      this.client.account_UserBalance()
      .subscribe(data => {
        this.balanceStatusSource.next(data);
      }, error => { console.error(error); });

      this.client.basket_BasketCount().subscribe(data => {
        this.basketStoreStatusSource.next(data);
      }, error => { console.error(error); });
    }
  }

  getProductModal(
    keyString: string,
    isShow = true,
    articul = '',
    tecDocBrandId = 0, ): ProductModal {
    const result: ProductModal = {
      keyString: keyString,
      isShow: isShow,
      articul: articul,
      tecDocBrandId: tecDocBrandId
    };
    return result;
  }

  getMenus(): Observable<any> {
    return this.client.menu_GetMainSection();
  }

  getScreenType(): number {
    this.screenType = this.checkScreenType(window.innerWidth);
    return this.screenType;
  }

  checkScreenType(width: number): number {
    if (width > 0 && width < 800) { this.partnerBorder = 0; }
    if (width >= 800 && width < 1200) { this.partnerBorder = 1; }
    if (width >= 1200 && width < 1600) { this.partnerBorder = 2; }
    if (width >= 1600) { this.partnerBorder = 2; }
    this.partnerTypeStatusSource.next(this.partnerBorder);
    let type = this.screenType;
    if (width > 0 && width <= 1024) {
      type = 2;
    }
    if (width > 1024 && width <= 1499) {
      type = 1;
    }
    if (width >= 1500) {
      type = 0;
    }
    if (type !== this.screenType) {
      this.screenType = type;
      this.screenTypeStatusSource.next(this.screenType);
    }
    return type;
  }

  checkActiveSetting(): Observable<SettingActiveResponse> {
    return this.client.setting_GetCommonBool();
  }
}
