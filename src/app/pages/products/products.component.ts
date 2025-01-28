import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { CategoryResponse, CategoryProductRequest, ProductPaginatorResponse, Client, PaginatorResponse, FilterRequest } from '../../../api/client';
import { BreadcrumbsLinked, Breadcrumbs } from '../../core/interfaces/breadcrumbs';
import { TagsInterface, SeoInterface } from '../../core/interfaces/seo';
import { environment } from '../../environments/environment.dev';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';
import { SeoService } from '../../services/http/seo.service';
import { MenuService } from '../../services/menu.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { BaseHttpService } from '../../services/http/base-http.service';
import { AuthService } from '../../services/authentication/auth.service.service';
import { ProductItemComponent } from '../../shared/components/product-item/product-item.component';
import { WishListService } from '../../services/wishlist.service';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '../../core/services/icon.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, PaginatorComponent, ProductItemComponent, MatIconModule],
  providers: [NotificationService,MenuService, BreadcrumbsService, BaseHttpService, AuthService, SeoService, WishListService, IconService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent {
  categories: CategoryResponse[];
  currentPage = 1;
  currentTake = 20;
  currentMinPrice = 0;
  currentMaxPrice = 0;
  currentOrderBy = 0;
  stringKey = '';
  prevStringKey = '';
  gridType = 0;
  checkIdsFromQuery: string[] = [];
  orderBy = environment.selectOrderBy;
  gridColumns = 5;
  productInLine = 5;
  topLabel = environment.topLabelDefault;
  newLabel = environment.newLabelDefault;
  categoryProductHelper: CategoryProductRequest = {};
  categoryProducts$: Observable<ProductPaginatorResponse> = new Observable();
  currentCategory: CategoryResponse;
  first = true;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  markChanges() {
    this.cdr.markForCheck();
  }

  constructor(
    private client: Client,
    private notify: NotificationService,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private router: Router,
    private location: Location,
    private breadcrumbsService: BreadcrumbsService,
    private seoService: SeoService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        if (params) {
          this.route
            .queryParams
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(params2 => {
              this.currentPage = params2['page'] ? params2['page'] : 1;
              this.currentTake = params2['take'] ? params2['take'] : 20;
              this.currentMinPrice = params2['minprice'] ? params2['minprice'] : 0;
              this.currentMaxPrice = params2['maxprice'] ? params2['maxprice'] : 0;
              this.currentOrderBy = params2['orderby'] ? params2['orderby'] : 0;
              this.checkIdsFromQuery = params2['ids'] ? params2['ids'].split(',') : [];
              this.stringKey = params2['category'];
              if (this.first) {
                this.initCategory();
              } else {
                this.initProducts();
              }
            });
        } else {
          this.router.navigate(['/catalog']);
        }
      });
  }

  ngOnInit() {
    this.gridType = 0;
    this.orderBy = environment.selectOrderBy;
    this.screenTypeListener();
    this.settingsListener();
    this.productWidthListener();
    this.columnListener();
    this.initProducts();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Смена типа грида
  changeGrid(type: number): void {
    this.gridType = type;
    this.menuService.gridTypeStatusSource.next(type);
  }

  // Смена грида, если ширина маленькая
  screenTypeListener(): void {
    this.menuService.screenTypeStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(type => {
        if (type === 2) {
          this.gridType = 0;
        }
      });
  }

  // Настройки для лейблов
  settingsListener(): void {
    if (this.menuService.siteSettings) {
      this.topLabel = this.menuService.siteSettings.topLabel.value;
      this.newLabel = this.menuService.siteSettings.newLabel.value;
    }
    this.menuService.settingsReadyStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.topLabel = this.menuService.siteSettings.topLabel.value;
          this.newLabel = this.menuService.siteSettings.newLabel.value;
        }
      });
  }

  // Слушаем ширину окна для грида
  productWidthListener(): void {
    this.menuService.productWidthStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          this.productInLine = data;
        }
      });
  }

  // Слушаем ширину окна для колонок
  columnListener(): void {
    this.menuService.columnStatus$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data !== this.gridColumns) {
          this.gridColumns = data;
        }
      });
  }

  // Смена страницы
  changePage(event: any): void {
    this.categoryProductHelper.paginator = event as PaginatorResponse;
    this.currentPage = this.categoryProductHelper.paginator.page;
    this.initUrlMain();
    this.initProducts();
  }

  // Смена количества на странице
  changeCount(event: any): void {
    if (this.categoryProductHelper.paginator.take !== event.target.value) {
      this.categoryProductHelper.paginator.take = event.target.value;
      this.categoryProductHelper.paginator.page = 1;
      this.currentPage = 1;
      this.initUrlMain();
      this.initProducts();
    }
  }

  // Смена сортировки
  changeOrderBy(event: any): void {
    if (this.categoryProductHelper.filter.orderBy !== +event.target.value) {
      this.categoryProductHelper.filter.orderBy = +event.target.value;
      this.categoryProductHelper.paginator.page = 1;
      this.currentPage = 1;
      this.initUrlMain();
      this.initProducts();
    }
  }

  // Ищем по фильтру
  filterChanged(event: any): void {
    const model = event as CategoryProductRequest;
    this.categoryProductHelper.filter = model.filter;
    this.categoryProductHelper.options = model.options;
    this.categoryProductHelper.optionByPostions = model.optionByPostions;
    this.categoryProductHelper.markId = model.markId;
    this.categoryProductHelper.modelId = model.modelId;
    this.currentPage = 1;
    if (this.categoryProductHelper && this.categoryProductHelper.filter && this.categoryProductHelper.filter.checkedOptionValues) {
      this.categoryProductHelper.filter.checkedOptionValues.map(x => this.checkIdsFromQuery.push(x.optionValueId));
      Array.from(new Set(this.checkIdsFromQuery.map((item: any) => item)));
      this.checkIdsFromQuery = [];
      this.categoryProductHelper.filter.checkedOptionValues.map(x => this.checkIdsFromQuery.push(x.optionValueId));
    } else {
      this.checkIdsFromQuery = [];
    }
    if (this.categoryProductHelper.filter.isReset) {
      this.currentMinPrice = 0;
      this.currentMaxPrice = this.categoryProductHelper.filter.maxPrice;
      this.currentTake = 20;
    }
    this.initUrlMain();
    this.initProducts();
  }

  // Дефолтная сортировка - лейбл
  getOrderTitle(): string {
    const index = this.orderBy.findIndex(x => x.id === Number(this.currentOrderBy) || x.stringKey === String(this.currentOrderBy));
    return index > -1 ? this.orderBy[index].title : '';
  }

  // Инициализация категории
  initCategory(): void {
    this.client.category_GetAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.categories = data as CategoryResponse[];
        this.client.category_GetByStringKey(this.stringKey)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(x => {
            this.currentCategory = x as CategoryResponse;
            this.initProdRes();
            this.initBreadcrumbs();
            this.firstInit();
          }, error => {
            this.notify.error('Не удалось получить целевой каталог', 'Ошибка');
            console.error(error);
          });
      }, error => {
        this.notify.error('Не удалось загрузить список каталогов', 'Ошибка');
        console.error(error);
      });

  }

  // Товары из категории по фильтру
  initProducts(): void {
    if (this.prevStringKey !== this.stringKey) {
      this.prevStringKey = this.stringKey;
      this.currentCategory = this.categories.find(x => x.stringKey === this.stringKey);
      this.menuService.ng5SliderStatusSource.next(true);
      this.firstInitMain();
      this.initBreadcrumbs();
    }
    const index = this.categories.findIndex(x => x.stringKey === this.stringKey);
    if (index > -1) {
      this.categoryProductHelper.categoryId = this.categories[index].id;
      this.currentCategory = this.categories[index];
    }
    if (!this.first) {
      this.menuService.spinnerStatusSource.next(true);
    }
    if (this.checkIdsFromQuery && this.checkIdsFromQuery.length > 0) {
      if (this.categoryProductHelper.optionByPostions && this.categoryProductHelper.optionByPostions.length > 0) {
        this.categoryProductHelper.valuesFromRoute = [];
        this.checkIdsFromQuery.map(x => {
          let result = false;
          this.categoryProductHelper.optionByPostions.map(y => {
            const index = y.option.values.findIndex(z => z.id === x);
            if (index > -1 && y.option.values[index].isCheck) {
              result = true;
            }
          });
          if (result) {
            this.categoryProductHelper.valuesFromRoute.push(x);
          }
        });
      } else {
        this.categoryProductHelper.valuesFromRoute = [];
        this.checkIdsFromQuery.map(x => this.categoryProductHelper.valuesFromRoute.push(x));
      }
    }
    console.log('here was');

    this.categoryProducts$ = this.client.product_GetCategoryProducts(this.categoryProductHelper)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((x) => {
          const model: CategoryProductRequest = {
            paginator: x.paginator,
            filter: x.filter,
            categoryId: this.categoryProductHelper.categoryId,
            currency: x.currency,
            options: x.options,
            optionByPostions: x.optionByPostions
          };
          this.categoryProductHelper = model;

          this.initUrlMain();
          this.menuService.paginatorStatusSource.next(this.categoryProductHelper.paginator);
          this.first = false;
          this.menuService.spinnerStatusSource.next(false);

          // Set current category
          this.currentCategory = this.categories.find(cat => cat.id === this.categoryProductHelper.categoryId);

          // Notify sale changes
          this.menuService.changeSaleFinal.next([this.currentCategory, this.categoryProductHelper]);
        })
      );
      this.cdr.detectChanges();

    // .subscribe(
    //   data => {
    //     this.categoryProducts = data as ProductPaginatorResponse;

    //     const model: CategoryProductRequest = {
    //       paginator: this.categoryProducts.paginator,
    //       filter: this.categoryProducts.filter,
    //       categoryId: this.categoryProductHelper.categoryId,
    //       currency: this.categoryProducts.currency,
    //       options: this.categoryProducts.options,
    //       optionByPostions: this.categoryProducts.optionByPostions
    //     };

    //     this.categoryProductHelper = model; // Update category helper after receiving data

    //     // Optional: Handle category being empty
    //     // this.categoryIsEmpty = this.categoryProducts.isEmpty;
    //     // if (!this.categoryIsEmpty) {
    //     //   this.count = this.categoryProductHelper.paginator.countTotal;
    //     // }

    //     this.initUrlMain();
    //     this.menuService.paginatorStatusSource.next(this.categoryProductHelper.paginator);
    //     this.first = false;
    //     this.menuService.spinnerStatusSource.next(false);

    //     // Set current category
    //     this.currentCategory = this.categories.find(x => x.id === this.categoryProductHelper.categoryId);

    //     // Notify sale changes
    //     this.menuService.changeSaleFinal.next([this.currentCategory, this.categoryProductHelper]);
    //   },
    //   error => {
    //     this.menuService.spinnerStatusSource.next(false);
    //     this.notify.error('Не удалось загрузить товары для каталога', 'Ошибка');
    //     console.error(error);
    //   }
    // );
  }

  // Установка сео
  initProdRes(): void {
    const modelSeo: TagsInterface[] = [{
      name: 'Description',
      content: this.currentCategory.seoDescription ? this.currentCategory.seoDescription : this.currentCategory.title
    },
      {
        name: 'Keywords',
        content: this.currentCategory.seoKeywords ? this.currentCategory.seoKeywords : this.currentCategory.title
      }];
    const resultSeo: SeoInterface = {
      title: this.currentCategory.title,
      tags: modelSeo
    };
    this.seoService.setSeo(resultSeo);
  }

  // Хлебные крошки
  initBreadcrumbs(): void {
    const model: BreadcrumbsLinked[] = [];
    this.currentCategory.breadcrumbs.map(x => {
      const prom: BreadcrumbsLinked = {
        title: x.title,
        url: x.url,
        linkType: 2
      };
      model.push(prom);
    });
    const result: Breadcrumbs = {
      title: this.currentCategory.title,
      url: this.currentCategory.stringKey,
      links: model,
      linkType: 1
    };
    this.breadcrumbsService.breadcrumbsStatusSource.next(result);
  }


  // Дефолтная смена адресной строки
  initUrlMain(): void {
    this.initUrl(
      this.stringKey,
      this.categoryProductHelper.paginator ? this.categoryProductHelper.paginator.page : 1,
      this.categoryProductHelper.filter ? this.categoryProductHelper.filter.currentMinPrice : 0,
      this.categoryProductHelper.filter ? this.categoryProductHelper.filter.currentMaxPrice : 0,
      this.categoryProductHelper.paginator ? this.categoryProductHelper.paginator.take : environment.takeCount,
      this.categoryProductHelper.filter ? this.categoryProductHelper.filter.orderBy : 0,
    );
  }

  resetState(): void {
    this.menuService.resetProductFilterState.next();
  }

  // Замена адресной строки на актульную
  initUrl(
    stringKey: string,
    page = 1,
    minPrice = 0,
    maxPrice = 0,
    take = environment.takeCount,
    orderBy = 0
  ): void {
    let url = '/products';
    if (stringKey) {
      url += '?category=' + encodeURIComponent('' + stringKey);
      url += '&page=' + encodeURIComponent('' + page);
      url += '&minprice=' + encodeURIComponent('' + minPrice);
      url += '&maxprice=' + encodeURIComponent('' + maxPrice);
      url += '&take=' + encodeURIComponent('' + take);
      url += '&orderby=' + encodeURIComponent('' + orderBy);
      if (this.checkIdsFromQuery && this.checkIdsFromQuery.length > 0) {
        url += '&ids=';
        this.checkIdsFromQuery.map((x, index) => {
          url += encodeURIComponent('' + x);
          if (index !== this.checkIdsFromQuery.length - 1) {
            url += ',';
          }
        });
      // this.location.go(url);
      this.location.replaceState(url);
      }
    }
  }

  // Получаем список id опций
  getCheckedRouteIds(): string {
    if (this.checkIdsFromQuery && this.checkIdsFromQuery.length > 0) {
      return this.checkIdsFromQuery.join();
    }
    return '';
  }

  // Первая инициализация хелпера для фильтра
  firstInit(): void {
    this.firstInitMain();
    this.initProducts();
  }

  firstInitMain(): void {
    const pageSelected: number[] = [];
    pageSelected.push(1);
    const paginator: PaginatorResponse = {
      countStart: 0,
      countFinish: 0,
      countTotal: 0,
      take: this.currentTake,
      page: this.currentPage,
      pageCount: 1,
      pageSelected: pageSelected
    };
    const filterLeft: FilterRequest = {
      isReset: true,
      minPrice: this.currentMinPrice,
      maxPrice: this.currentMaxPrice,
      currentMinPrice: this.currentMinPrice,
      currentMaxPrice: this.currentMaxPrice,
      orderBy: 0
    };
    const model: CategoryProductRequest = {
      paginator: paginator,
      filter: filterLeft,
      categoryId: this.currentCategory.id
    };
    this.categoryProductHelper = model as CategoryProductRequest;
    this.categoryProductHelper.filter.isReset = !this.checkNotResetFilter();
  }

  // Проверка фильтра на сброс
  checkNotResetFilter(): boolean {
    if (this.categoryProductHelper && this.categoryProductHelper.filter) {
      return this.categoryProductHelper.filter.checkedOptionValues && this.categoryProductHelper.filter.checkedOptionValues.length > 0 ||
        this.categoryProductHelper.filter.currentMinPrice !== this.categoryProductHelper.filter.currentMaxPrice;
    }
    return false;
  }
}
