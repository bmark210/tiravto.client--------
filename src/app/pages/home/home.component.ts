import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HomeModule } from './imports';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, Subject, takeUntil, timer } from 'rxjs';
import {
  ProductHomePageResponse,
  SettingActiveResponse,
  SliderResponse,
  ArticleResponse,
  MenuSectionResponse,
  PageProductHomeSectionsResponse,
  Client,
  CategoryResponse,
} from '../../../api/client';
import { environment } from '../../environments/environment.dev';
import { ArrayService } from '../../services/array.service';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/authentication/auth.service.service';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';
import { SeoService } from '../../services/http/seo.service';
import { MenuService } from '../../services/menu.service';
import {
  BreadcrumbsLinked,
  Breadcrumbs,
} from '../../core/interfaces/breadcrumbs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AsyncPipe, CommonModule, JsonPipe, NgSwitch } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/pipes/safeHtml.pipe';
import { HomeRelatedComponent } from '../../shared/components/home-related/home-related.component';
import { ProductItemComponent } from '../../shared/components/product-item/product-item.component';
import { BaseHttpService } from '../../services/http/base-http.service';
import { NotificationService } from '../../services/notification.service';
import { WishListService } from '../../services/wishlist.service';
import { CategoriesMenuService } from '../../core/services/api/categories-menu.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MaterialModule } from '../../shared/modules/material';
import {
  MAT_MENU_DEFAULT_OPTIONS,
  MatMenu,
  MatMenuTrigger,
} from '@angular/material/menu';
import { CustomMatMenuComponent } from './components/custom-mat-menu/custom-mat-menu.component';
import { MenuModule } from '../../shared/modules/menu-module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
// import { MatMenuHoverDirective } from 'ngx-mat-menu-hover';

@UntilDestroy()
@Component({
  selector: 'app-home',
  imports: [
    HomeModule,
    MenuModule,
    CarouselModule,
    NzTabsModule,
    CommonModule,
    SafeHtmlPipe,
    HomeRelatedComponent,
    ProductItemComponent,
    NgSwitch,
    MaterialModule,
    RouterModule,
    NzIconModule,
    CustomMatMenuComponent,
  ],
  providers: [
    MenuService,
    BaseHttpService,
    NotificationService,
    AuthService,
    SeoService,
    ArrayService,
    ArticleService,
    BreadcrumbsService,
    WishListService,
    CategoriesMenuService,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('mainMenu') menu: MatMenu;

  products$: Observable<ProductHomePageResponse[]> = of([]);
  imgUrl: string = environment.productImageUrl;

  iconSLider: any;

  sectionActive = 1;

  settingBool: SettingActiveResponse;

  @ViewChild('sliderMain') sliderMain: ElementRef;
  slider: SliderResponse;
  mySlideOptions = {
    items: 1,
    dots: false,
    nav: false,
    autoplay: true,
    loop: true,
    autoplayTimeout: 8000,
    animateOut: 'fadeOut',
    URLhashListener: true,
    startPosition: 'URLHash',
  };
  myRelatedOptions = {
    dots: false,
    nav: false,
    items: 1,
    autoplay: true,
    loop: true,
    autoplayTimeout: 8000,
    // animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    URLhashListener: true,
    startPosition: 'URLHash',
  };

  activeMainSliderIndex = -1;

  myRelatedOptionsMobile = {
    autoplay: true,
    loop: true,
    autoplayTimeout: 8000,
    animateOut: 'fadeOut',
    URLhashListener: true,
    startPosition: 'URLHash',
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      580: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1300: {
        items: 4,
      },
    },
  };

  categories: CategoryResponse[];

  homeArticles: ArticleResponse[];

  menus: MenuSectionResponse;

  productsHome: PageProductHomeSectionsResponse;

  screenType = 0;

  storagePath = environment.productImageUrl;
  // pathImage: string = environment.storageUrl + environment.noPhotoUrl;
  readonly optimizePoint: string = '/500x500/f=webp';

  sectionDesktopTop: any;
  sectionDesktopSale: any;
  sectionDesktopNew: any;

  timerStopped = true;
  timemerSubscribe: any;

  topLabel = 'environment.topLabelDefault';
  newLabel = 'environment.newLabelDefault';

  isSlicedMenu: boolean = false;

  constructor(
    private menuService: MenuService,
    private seoService: SeoService,
    private client: Client,
    private arrayService: ArrayService,
    private articleService: ArticleService,
    private breadcrumbsService: BreadcrumbsService,
    private authService: AuthService,
    private router: Router,
    private categoryMenu: CategoriesMenuService,
    private cdr: ChangeDetectorRef // private iconRegistry: MatIconRegistry,
  ) // private sanitizer: DomSanitizer,
  // private iconService: IconService
  {
    this.seoService.defaultSeo();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.initBreadcrumbs();
    this.initSlider();
    this.initMenus();
    this.initHomeProducts();
    this.initHomeArticles();
    this.initMobile();
    this.settingsListener();
    this.menuService.homeStatusSource.next(true);
    this.getCategories();
    // this.iconSLider = environment.menuSliderIcon;

    //  this.iconRegistry.addSvgIcon('heart', this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/heart.svg') // path to the SVG
    // );
  }

  getCategories() {
    this.categoryMenu
      .getAllCategories()
      .pipe(untilDestroyed(this))
      .subscribe((x) => {
        this.categories = x;
        console.log(x);
      });
  }

  getParams(stringKey: string) {
    return {
      category: stringKey,
      page: 1,
      take: 20,
      minprice: 0,
      maxprice: 0,
      orderby: 0,
    };
  }

  saveMenu(menu: MatMenu, id: string): void {
    this.menus[id] = menu;
  }

  openMenu(menuTrigger: MatMenuTrigger): void {
    setTimeout(() => {
      menuTrigger.openMenu();
    }, 100);
  }
  closeMenu(menuTrigger: MatMenuTrigger): void {
    setTimeout(() => {
      menuTrigger.closeMenu();
    }, 100);
  }

  settingsListener(): void {
    if (this.menuService.siteSettings) {
      this.topLabel = this.menuService.siteSettings.topLabel.value;
      this.newLabel = this.menuService.siteSettings.newLabel.value;
    }
    this.menuService.settingsReadyStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          this.topLabel = this.menuService.siteSettings.topLabel.value;
          this.newLabel = this.menuService.siteSettings.newLabel.value;
        }
      });
    this.menuService.settingBoolStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          this.settingBool = data as SettingActiveResponse;
        }
      });
  }

  initTimer() {
    if (this.timerStopped === false) {
      return;
    }
    this.timerStopped = false;
    this.timemerSubscribe = timer(0, 500)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((t) => {
        const elements: HTMLCollection =
          document.getElementsByClassName('owl-item active');
        this.slider.items.map((x, index) => {
          if (elements[0] && elements[0].children) {
            const el = elements[0].children.namedItem(String(x.id));
            if (el) {
              if (index !== this.activeMainSliderIndex) {
                this.activeMainSliderIndex = index;
              }
            }
          }
        });
      });
  }

  getIconByStringKey(stringKey: string): string {
    const index = this.iconSLider?.findIndex(
      (x: any) => x?.stringKey === stringKey
    );
    return index > -1 ? this.iconSLider?.[index].content : '';
  }

  stopTimer() {
    if (this.timerStopped === false) {
      this.timemerSubscribe.unsubscribe();
      this.timerStopped = true;
    }
  }

  public ngOnDestroy(): void {
    this.stopTimer();
    this.menuService.homeStatusSource.next(false);
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  goToMailContact(): void {
    if (this.authService.isAuthenticated()) {
      this.navigateTo('/profile/mailing');
    } else {
      this.menuService.modalContactStatusSource.next(true);
    }
  }

  goToTecDoc(): void {
    if (this.settingBool && this.settingBool.tecDoc) {
      this.navigateTo('/tecdoc');
    }
  }

  initMobile(): void {
    this.menuService.screenTypeStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state) => {
        this.screenType = state;
      });
  }

  initSlider(): void {
    this.client
      .slider_GetMainSlider()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.slider = data as SliderResponse;
          // tslint:disable-next-line:max-line-length
          this.slider.items.map((x) => {
            x.image = this.storagePath + x.image;
            // AppConfig.settings.storageUrl.url + environment.sliderMain + x.image;
            x.backgroundImage = `url(${this.storagePath}${x.backgroundImage})`;
          });
          this.cdr.markForCheck();
          this.initTimer();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  initMenus(): void {
    this.menuService
      .getMenus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.menus = data as MenuSectionResponse;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  initHomeArticles(): void {
    this.client
      .article_GetHomeArticles()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data) => {
          this.homeArticles = data as ArticleResponse[];
          this.cdr.markForCheck();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  initHomeProducts(): void {
    this.client.product_GetHomeProducts().subscribe({
      next: (data: PageProductHomeSectionsResponse) => {
        this.productsHome = data as PageProductHomeSectionsResponse;

        this.productsHome.section.forEach((x) => {
          x.products.forEach((y) => {
            y.images = y.images.map((z) => {
              return { ...z, originalUrl: z.originalUrl };
            });
          });
        });
        this.products$ = of(data['section']);
        // this.products.subscribe((x) => {
        //   console.log(x, 'products');
        // })
        // console.log(this.products, 'products');

        // this.products$.forEach((x) => {
        // x.products.forEach((y: any) => {
        //   y.images = y.images.map((z: any) => {
        //     return { ...z, originalUrl: z.originalUrl };
        //   });
        // });
        // });

        this.sectionDesktopSale = this.arrayService.chunck(
          this.productsHome.section[0].products,
          8
        );
        this.sectionDesktopNew = this.arrayService.chunck(
          this.productsHome.section[1].products,
          8
        );
        this.sectionDesktopTop = this.arrayService.chunck(
          this.productsHome.section[2].products,
          8
        );
        // this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  headerMenuNavigate(url: string, stringKey: string): void {
    this.router.navigate([url]);
  }

  initBreadcrumbs(): void {
    const model: BreadcrumbsLinked[] = [];
    const result: Breadcrumbs = {
      title: '',
      url: '/',
      links: model,
      linkType: 0,
    };
    this.breadcrumbsService.breadcrumbsStatusSource.next(result);
  }

  navigateTo(url: string): void {
    window.scroll(0, 0);
    this.router.navigate([url]);
  }
}
