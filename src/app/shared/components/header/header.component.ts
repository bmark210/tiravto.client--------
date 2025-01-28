import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import {
  BasketCityResponse,
  BasketCountResponse,
  BasketRequest,
  CategoryResponse,
  Client,
  MenuResponse,
  SettingActiveResponse,
  UserProfileResponse,
} from '../../../../api/client';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserActions } from '../../../store/actions/user.actions';
import { UserState } from '../../../store/reducers/user.reducer';
import { WishListService } from '../../../services/wishlist.service';
import { AuthService } from '../../../services/authentication/auth.service.service';
import { BasketService } from '../../../services/basket.service';
import { BaseHttpService } from '../../../services/http/base-http.service';
import { MenuService } from '../../../services/menu.service';
import { NotificationService } from '../../../services/notification.service';
import { StorageService } from '../../../services/storage.service';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { environment } from '../../../environments/environment.dev';
import { SearchComponent } from '../search/search.component';
import { MaterialModule } from '../../modules/material';
import { DynamicMenuComponent } from '../dynamic-menu/dynamic-menu.component';
import { CategoryButtonComponent } from '../category-button/category-button.component';
import { HeaderCategoryBtnComponent } from '../header-category-btn/header-category-btn.component';
import { CustomMatMenuComponent } from '../../../pages/home/components/custom-mat-menu/custom-mat-menu.component';
import { MenuModule } from '../../modules/menu-module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@UntilDestroy()
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    SearchComponent,
    MaterialModule,
    DynamicMenuComponent,
    CategoryButtonComponent,
    HeaderCategoryBtnComponent,
    MenuModule,
    NzIconModule,
    CustomMatMenuComponent,
    NzMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @ViewChild('menu', { static: true }) menu!: ElementRef<HTMLUListElement>;

  menuItems = [
    { label: 'Navigation One', icon: 'mail', selected: true, disabled: false },
    {
      label: 'Navigation Two',
      icon: 'appstore',
      selected: false,
      disabled: true,
    },
    {
      label: 'Navigation Three - Submenu',
      icon: 'setting',
      selected: false,
      disabled: false,
    },
    {
      label: 'Navigation Four - Link',
      icon: null,
      selected: false,
      disabled: false,
    },
  ];

  visibleItems = [...this.menuItems];
  overflowItems: any[] = [];

  ngAfterViewInit() {
    this.updateMenuItems();
    window.addEventListener('resize', ($event: any) =>
      this.updateHeaderMenu($event)
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.updateMenuItems();
  }

  private updateMenuItems() {
    const menuWidth = this.menu.nativeElement.offsetWidth;
    const items = Array.from(this.menu.nativeElement.children) as HTMLElement[];
    const moreMenu = items.find((item) => item.classList.contains('more-menu'));
    let availableWidth = menuWidth - (moreMenu ? moreMenu.offsetWidth : 0);

    this.visibleItems = [];
    this.overflowItems = [];

    for (const item of this.menuItems) {
      const menuItem = items.find(
        (child) => child.textContent?.trim() === item.label
      );
      if (menuItem && menuItem.offsetWidth <= availableWidth) {
        this.visibleItems.push(item);
        availableWidth -= menuItem.offsetWidth;
      } else {
        this.overflowItems.push(item);
      }
    }
  }

  @Output() openSidebar: EventEmitter<void> = new EventEmitter(null);

  user$: Observable<UserState> = new BehaviorSubject<UserState>(
    {} as UserState
  );

  loadUser() {
    this.store.dispatch(
      UserActions.setUser({
        user: { id: '2', name: 'Alice', email: 'alice@example.com' },
      })
    );
  }

  clearUser() {
    this.store.dispatch(UserActions.clearUser());
  }

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input() categories: CategoryResponse[] = [];
  @Input() header: MenuResponse[];
  @Input() headerFixed: boolean;
  @Input() countMainCategory: number;

  @ViewChild('maxWidthMenu') maxWidthMenu: ElementRef;
  @ViewChild('imgHeader') imgHeader: ElementRef;
  @ViewChild('headerMenu') headerMenu: ElementRef;
  @ViewChild('rightHeader') rightHeader: ElementRef;

  width: number;
  updateHeaderMenu(e: any) {
    this.width = e.currentTarget.innerWidth;

    let width = e.currentTarget.innerWidth;
    if (width <= 1420) {
    }
    console.log(e);
    this.headerMenu.nativeElement as HTMLElement;
  }

  searchActual: string = '';

  updateSearch = new BehaviorSubject<string>(this.searchActual);

  settingBool: SettingActiveResponse;

  showMenu = false;
  // menues: INavMenuInterface[] = [];
  // menuitems: INavMenuItemInterface[] = [];
  isLogin = false;

  basketFull: BasketCityResponse[];
  basketReady = false;

  countWish = 0;

  balance = 0;

  priceTotal = 0;
  countTotal = 0;
  symbol = '';

  isHome = false;

  profile: UserProfileResponse;
  userName = 'Профиль';

  socialPath = 'AppConfig.settings.storageUrl.url + environment.socialPath';
  imageNoPhoto = 'AppConfig.settings.storageUrl.url + environment.noPhotoUrl';
  imagePath = environment.productImageUrl;

  showShortBasket = false;

  hoverStringKey: string;

  parentCategory: CategoryResponse;
  isParent = false;

  basketCount: BasketCountResponse;

  timeoutHandle: any;
  timeoutBasketHandle: any;

  pathImage: string;

  isAdmin = false;

  tecDocActive = false;

  messageCount = 0;

  rightHeaderWidth = 190;

  menusWidth: number[] = [];

  currentPath: Subject<string> = new Subject<string>();

  constructor(
    private renderer: Renderer2,
    private baseHttpService: BaseHttpService,
    private authService: AuthService,
    private basketService: BasketService,
    private menuService: MenuService,
    private guard: AuthGuard,
    private router: Router,
    private notify: NotificationService,
    private storage: StorageService,
    private wishListService: WishListService,
    private client: Client,
    private route: ActivatedRoute,
    private store: Store<{ user: UserState }>
  ) {}

  ngOnInit() {
    this.user$ = this.store.select('user'); // Select user state
    this.currentPath.next(window.location.pathname);

    if (this.route.queryParams) {
      this.route.queryParams.subscribe((queryParams: any) => {
        if (queryParams.code) {
          this.updateSearch.next(queryParams.code);
        }
      });
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Get the current path from the URL
        this.currentPath.next(window.location.pathname);
        console.log('Current Path:', this.currentPath);
      }
    });
    this.checkWidthHeader();
    this.menusWidth.push(160);
    this.menusWidth.push(190);
    this.menusWidth.push(175);
    this.menusWidth.push(115);
    this.menuService.settingBoolStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state) => {
        this.tecDocActive = state ? state.tecDoc : true;
      });
    this.authService.authNavStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state) => {
        this.isAdmin = this.guard.inRole(environment.roles.admin);
        this.isLogin = state;
        this.rightHeaderWidth = state ? 425 : 190;
        if (!this.isLogin) {
          this.countWish = 0;
          this.countTotal = 0;
          this.priceTotal = 0;
          if (this.basketCount) {
            this.basketCount.symbol = 'руб.';
          }
        }
        this.checkWidthHeader();
      });
    this.initBasketCount();
    this.wishListService.initCount();
    this.wishListService.countWishStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.countWish = data;
      });
    this.isLogin = this.authService.isLoggedIn();
    this.basketCount = this.basketService.getBasketCount();
    this.initChat();
    this.basketService.basketCountStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.initBasket();
      });
    this.menuService.homeStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state) => {
        this.isHome = state;
        this.isParent = false;
        this.parentCategory = null;
        this.showMenu = state;

        this.menuService.initBalance();
      });
    this.menuService.balanceStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.balance = data;
      });
    this.userName = this.authService.profile
      ? this.authService.profile.userName
      : 'Профиль';
    this.authService.profileStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          this.profile = data[0];
          this.userName = data[1];
        }
      });
    this.menuService
      .checkActiveSetting()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.settingBool = data as SettingActiveResponse;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  checkWidthHeader(): void {
    let wrapper = 0;
    if (!this.maxWidthMenu) {
      wrapper = window.innerWidth - 200;
    } else {
      wrapper = this.maxWidthMenu.nativeElement.offsetWidth;
    }
    let result = 0;
    let fact = 220 + this.rightHeaderWidth + 250;
    while (fact + this.menusWidth[result] < wrapper) {
      fact += this.menusWidth[result];
      result++;
    }
    this.menuService.menuIntensifies = result;
    this.menuService.menuIntensifiesSource.next(result);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event): void {
  // event.target.innerWidth
  // this.checkWidthHeader();
  // }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setTimeOutBasket(): void {
    if (this.timeoutBasketHandle) {
      window.clearTimeout(this.timeoutBasketHandle);
    }
    this.timeoutBasketHandle = window.setTimeout(() => {
      this.showShortBasket = false;
    }, 500);
  }

  resetTimeOutBasket(): void {
    if (this.timeoutBasketHandle) {
      window.clearTimeout(this.timeoutBasketHandle);
    }
  }

  initBasket(): void {
    this.basketService
      .initBasket()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.basketFull = data as BasketCityResponse[];
          this.basketReady = true;
          if (this.basketFull && this.basketFull.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.basketFull.map((x) =>
              x.cityBasket.items.map(
                (y) =>
                  (y.product.iconUrl = y.product.iconUrl
                    ? `${this.imagePath}${y.product.iconUrl}`
                    : this.imageNoPhoto)
              )
            );
            this.reInitPriceChange();
          } else {
            this.countTotal = 0;
            this.priceTotal = 0;
          }
        },
        (error) => {}
      );
  }

  reInitPriceChange(): void {
    if (this.basketFull) {
      const add = (a, b) => a + b;
      let sum = 0;
      sum = this.basketFull.map((x) => x.cityBasket.price).reduce(add);
      this.priceTotal = sum;
      sum = 0;
      sum = this.basketFull.map((x) => x.cityBasket.totalCount).reduce(add);
      this.countTotal = sum;
      this.symbol = this.basketFull[0].currency.symbol;
      if (!this.symbol) {
        this.symbol = environment.currency.PRB.symbol;
      }
    }
  }

  initChat(): void {
    this.notify.messageCountStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((count) => {
        this.messageCount = count as number;
      });
  }

  logout(): void {
    this.baseHttpService
      .get('/api/Account/logout')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.authService.logout();
          //  window.location.reload();
          // this.basketService.initCount();
        },
        (error) => {
          this.notify.error('Не удалось выполнить запрос', 'Ошибка');
          console.error(error);
        }
      );
  }

  sideNav(): void {
    this.menuService.sideNavStatusSource.next(true);
  }

  parentChanged(state: boolean, index?: number): void {
    if (state && index > -1 && this.categories[index].child.length > 0) {
      if (this.categories[index].image) {
        this.pathImage =
          environment.productImageUrl +
          environment.categoryImageUrl +
          this.categories[index].id +
          '/' +
          this.categories[index].image;
      } else {
        this.pathImage = environment.productImageUrl + environment.noPhotoUrl;
      }
      this.parentCategory = this.categories[index];
      this.isParent = true;
    } else {
      this.isParent = false;
      this.parentCategory = null;
    }
  }

  categoryMenuMouseLeave(): void {
    this.parentChanged(false);
    this.setTimeOut();
  }

  removeBasketItem(index: number, indexProd: number): void {
    const count = this.basketFull[index].cityBasket.items[indexProd].count;
    const price = this.basketFull[index].cityBasket.items[indexProd].price;
    const oldBasket = this.basketService.getBasketCount();
    const newBasket = oldBasket;
    newBasket.count -= count;
    newBasket.priceTotal -= count * price;

    const removed = this.getBasketRequest(index, indexProd, false);
    const check = this.storage.removeProduct(removed);
    if (check) {
      this.basketFull[index].cityBasket.items.splice(index, 1);
      this.basketService.basketItemRemoveStatusSource.next(true);
      this.basketService.basketCountStatusSource.next(newBasket);
      this.basketService.basketCardRemoveStatusSource.next(true);
      this.countTotal -= count;
    } else {
      if (
        this.authService.isLoggedIn &&
        this.basketFull[index].cityBasket.items[indexProd]
      ) {
        const model = this.getBasketRequest(index, indexProd, false);
        this.client
          .basket_RemoveItem(model)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (data) => {
              if (data) {
                this.basketFull[index].cityBasket.items.splice(indexProd, 1);
                this.basketService.basketItemRemoveStatusSource.next(true);
                this.basketService.basketCountStatusSource.next(newBasket);
                this.basketService.basketCardRemoveStatusSource.next(true);
                this.countTotal -= count;
              }
            },
            (error) => {
              this.notify.error('Не удалось удалить товар', 'Корзина');
              this.basketService.basketCountStatusSource.next(oldBasket);
              console.error(error);
            }
          );
      }
    }
  }

  navigateTo(stringKey: string): void {
    window.scroll(0, 0);
    this.router.navigate([`/product/${stringKey}`]);
  }

  openTecDoc(): void {
    window.scroll(0, 0);
    this.router.navigate([`/tecdoc`]);
  }

  getBasketRequest(
    index: number,
    indexProd: number,
    state: boolean
  ): BasketRequest {
    const result: BasketRequest = {
      storeId: this.basketFull[index].store.id,
      count: this.basketFull[index].cityBasket.items[indexProd].count,
      productId: this.basketFull[index].cityBasket.items[indexProd].productId,
      maxCountInStore:
        this.basketFull[index].cityBasket.items[indexProd].maxCountInStore,
      selected: state,
    };
    return result;
  }

  setTimeOut(): void {
    if (this.isHome) {
      return;
    }
    this.resetMenuAll(true);
    // if (this.timeoutHandle) {
    //   window.clearTimeout(this.timeoutHandle);
    // }
    // this.timeoutHandle = window.setTimeout(() => {
    //   this.resetMenuAll(true);
    // },
    //   500);
  }

  resetMenuAll(state: boolean): void {
    if (!state) {
      this.isParent = false;
      this.parentCategory = null;
      this.showMenu = true;
    } else {
      this.isParent = false;
      this.parentCategory = null;
      this.showMenu = false;
    }
  }

  resetTimeOut(): void {
    if (this.timeoutHandle) {
      window.clearTimeout(this.timeoutHandle);
    }
  }

  initBasketCount(): void {
    this.basketService.basketCountStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((count) => {
        if (count) {
          this.basketCount = count as BasketCountResponse;
        } else {
          const data: BasketCountResponse = {
            count: 0,
            priceTotal: 0,
            symbol: 'руб.',
          };
        }
        this.menuService.basketStoreStatusSource.next(count);
      });

    this.menuService.basketStoreStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((count) => {
        if (this.basketCount) {
          this.basketCount.store = count.store;
        }
      });
    // this.basketService.initCount();
  }

  basketClick() {
    if (this.router.url === '/basket') {
      this.menuService.basketClickSource.next(true);
    }
  }

  checkCategoryHover(i: any): void {
    this.resetMenu();
    this.categories[i].showCategory = true;
  }

  resetMenu(): void {
    if (this.categories) {
      this.categories.map((x) => (x.showCategory = false));
    }
  }

  menuHover(stringKey: string): void {
    this.hoverStringKey = stringKey;
  }

  menuHoverLeave(stringKey: string): void {
    this.hoverStringKey = '';
  }

  menuNavigate(menuIndex: any, subMenuIndex: any): void {
    let url = '';
    if (subMenuIndex > -1) {
      // tslint:disable-next-line:max-line-length
      url = this.header[menuIndex].items[subMenuIndex].page
        ? `/pages${this.header[menuIndex].items[subMenuIndex].page.url}`
        : this.header[menuIndex].items[subMenuIndex].url;
    } else {
      url = this.header[menuIndex].page
        ? `/pages${this.header[menuIndex].page.url}`
        : this.header[menuIndex].url;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.router.navigate([url]);
  }
}
