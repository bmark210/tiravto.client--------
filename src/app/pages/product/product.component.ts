import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Subject, BehaviorSubject, Subscription, takeUntil } from 'rxjs';
import { ProductPageResponse, ProductAnalogHelper, BasketRequest, CarApplicabilityMarksResponse, Client, PaginatorResponse } from '../../../api/client';
import { BreadcrumbsLinked, Breadcrumbs } from '../../core/interfaces/breadcrumbs';
import { TagsInterface, SeoInterface } from '../../core/interfaces/seo';
import { environment } from '../../environments/environment.dev';
import { AuthService } from '../../services/authentication/auth.service.service';
import { BasketService } from '../../services/basket.service';
import { BreadcrumbsService } from '../../services/breadcrumbs.service';
import { ErrorService } from '../../services/error.service';
import { SeoService } from '../../services/http/seo.service';
import { MenuService } from '../../services/menu.service';
import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { WishListService } from '../../services/wishlist.service';
import { GalleryComponent, GalleryError, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from '../../shared/modules/material';
import { SafeHtmlPipe } from '../../shared/pipes/safeHtml.pipe';
import { BaseHttpService } from '../../services/http/base-http.service';
import { CustomMatMenuComponent } from '../home/components/custom-mat-menu/custom-mat-menu.component';

@Component({
  selector: 'app-product',
  imports: [CommonModule, GalleryComponent, ReactiveFormsModule, FormsModule, MatIcon, MaterialModule, RouterLink, SafeHtmlPipe, CustomMatMenuComponent],
  providers: [BasketService, BaseHttpService, NotificationService, AuthService, StorageService, BreadcrumbsService, MenuService, ErrorService, SeoService, WishListService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loadError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // public EditorFull = ClassicEditorFull;

  noPhotoUrl: string = environment.storageUrl + environment.noPhotoUrl;

  product: ProductPageResponse;
  analogHelper: ProductAnalogHelper;

  @ViewChild('gallery') gallery: GalleryComponent;

  openLightbox(index: number) {
    this.lightbox.open(index, 'product-gallery');
  }

  onLoadError(error: GalleryError): void {
    if (error) {
      this.loadError.next(true);
    }
  }

  isFormGroup(control: AbstractControl): control is FormGroup {
    return control instanceof FormGroup;
  }

  galleryImages: ImageItem[] = [];

  storageBasket: BasketRequest[];

  productCountArray = new FormArray<FormGroup>([]);

  pathImage = environment.productImageUrl;
  symbol: string;
  isExist = true;
  paramsSubscription: Subscription;

  aplShow = false;

  keyString = '';
  articul = '';
  tecDocBrandId = 0;

  selectedTab = new FormControl(0);
  analogReady = false;

  allCarMarks: CarApplicabilityMarksResponse[];

  constructor(
    private route: ActivatedRoute,
    private client: Client,
    private fb: FormBuilder,
    private basketService: BasketService,
    private authService: AuthService,
    private storage: StorageService,
    private breadcrumbsService: BreadcrumbsService,
    private menuService: MenuService,
    private errorService: ErrorService,
    private seoService: SeoService,
    private notify: NotificationService,
    private wishListService: WishListService,
    public lightbox: Lightbox,
    private cdr: ChangeDetectorRef
  ) {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      if (params && params["articul"] && params["articul"]?.length > 0) {
        this.storageBasket = this.storage.getBasket();
        this.keyString = params["articul"];
        this.initProduct(this.keyString, null, 0);
      }
    });
    this.paramsSubscription = this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams["code"] && queryParams["code"]?.length > 0) {
        this.storageBasket = this.storage.getBasket();

        this.articul = this.route.snapshot.queryParams['code'];
        this.tecDocBrandId = this.route.snapshot.queryParams['tecDocBrandId'];
        this.initProduct('', this.articul, this.tecDocBrandId);
      }
    });
  }


  ngOnInit() {
    window.scroll(0, 0);
    this.basketService.basketCardRemoveStatus$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        if (state && this.product && this.product.storeProduct && this.product.storeProduct.length > 0) {
          this.product.storeProduct.map(x => x.countInBasketReload = 0);
        }
      });
    this.initTecDocCarMarks();
  }

  initTecDocCarMarks() {
    if (this.tecDocBrandId && this.articul) {
      this.client.product_GetProductApplyCars(this.articul, this.tecDocBrandId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          this.allCarMarks = data as CarApplicabilityMarksResponse[];
          this.aplShow = this.allCarMarks && this.allCarMarks.length > 0;
        }, error => {
          console.error(error);
        });
    }
  }

  public ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();

    this.paramsSubscription.unsubscribe();
  }

  initWish(): void {
    if (this.keyString) {
      this.product.isWish = this.wishListService.initWish(this.product.isWish, this.product.id, this.product.wishItemId);
    }
  }

  backClicked(): void {
    // this.location.back();
  }


createFormControls(): void {
  this.productCountArray = new FormArray<FormGroup>([]);

  this.product.storeProduct.forEach((storeProduct) => {
    const countValue =
      storeProduct.count > 0 && (storeProduct.count - storeProduct.countInBasketReload) > 0 ? 1 : 0;

    const formGroup = this.fb.group({
      count: new FormControl(countValue), // Начальное значение для количества
      storeId: new FormControl(storeProduct.store.id), // ID магазина
      delivery: new FormControl(storeProduct.delivery), // Доставка
      isDelivery: new FormControl(storeProduct.isDelivery), // Доступна ли доставка
      productId: new FormControl(this.product.id), // ID продукта
      maxCountInStore: new FormControl(storeProduct.count) // Максимальное количество на складе
    });

    this.productCountArray.push(formGroup);
  });
}


  calculateCount(type: string, control: FormGroup): void {
    if (control) {
      const index = this.product.storeProduct.findIndex(x => x.store.id === control.value.storeId);
      const count = control.value.count;
      const maxCount = this.product.storeProduct[index].count - this.product.storeProduct[index].countInBasketReload;
      let result = 0;
      if (index > -1) {
        if (type === 'minus') {
          result = count > 0 ? count - 1 : 0;
        }
        if (type === 'plus') {
          result = count >= maxCount ? maxCount : count + 1;
        }
        if (type === 'press') {
          if (count > maxCount) {
            result = maxCount;
          } else {
            if (count < 0) {
              result = 0;
            } else {
              result = count;
            }
          }
        }
        this.productCountArray.controls[index]['controls']["count"].setValue(result);
        this.product.storeProduct[index].countInBasket = result;
      }
    }
  }

  markChanges() {
    this.cdr.markForCheck();
  }

  showStore(index: number): void {
    const state = this.product.storeProduct[index].isExpand;
    this.product.storeProduct.map(x => x.isExpand = false);
    this.product.storeProduct[index].isExpand = !state;
  }

  addToBasket(index: number): void {
    if (this.productCountArray.value[index].count > 0) {
      const maxCount = this.product.storeProduct[index].count - this.product.storeProduct[index].countInBasketReload;
      if (this.productCountArray.value[index].count <= maxCount) {
        const model = this.getBasketRequest(index, false);
        if (this.authService.isLoggedIn()) {
          this.basketService.addToBasket(model)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
              this.initCount(this.productCountArray.value[index].count, this.product.storeProduct[index].isDelivery, this.product.storeProduct[index].price);
              this.product.storeProduct[index].countInBasketReload += this.productCountArray.value[index].count;
              this.checkArrayControl(index);
              this.notify.success('Товар добавлен в корзину', 'Корзина');
            },
            error => {
              this.notify.error('Не удалось добавить товар в корзину', 'Ошибка');
              console.error(error);
            });
        } else {
          // Логика для добавления товара в корзину без авторизации в локалсторедж
          // this.storage.addProducts(model);
          // this.product.storeProduct[index].countInBasketReload += this.productCountArray.value[index].count;
          // this.initCount(this.productCountArray.value[index].count, this.product.storeProduct[index].isDelivery, this.product.storeProduct[index].price);
          // this.checkArrayControl(index);
          this.notify.warning('Авторизуйтесь для добавления в корзину', 'Корзина');
        }
      } else {
        this.notify.warning('Больше нет на складе', 'Корзина');
      }
    }
  }

  checkArrayControl(index: number): void {
    const maxCount = this.product.storeProduct[index].count - this.product.storeProduct[index].countInBasketReload;
    if (this.productCountArray.value[index].count > maxCount) {
      const control = <FormArray>this.productCountArray;
      <FormArray>control.controls[index]['controls'].count.setValue(maxCount);
    }
  }

  initCount(count: number, isDelivery: boolean, deliveryPrice: number): void {
    const model = this.basketService.getBasketCount();
    model.count += count;
    const price = isDelivery ? deliveryPrice : this.product.isDiscount ? this.product.discountPrice : this.product.price;
    model.priceTotal += price * count;
    this.basketService.basketCountStatusSource.next(model);
  }

  getBasketRequest(index: number, state: boolean): BasketRequest[] {
    const result: BasketRequest[] = [
      {
        count: this.productCountArray.value[index].count,
        productId: this.product.id,
        storeId: this.productCountArray.value[index].storeId,
        maxCountInStore: this.productCountArray.value[index].maxCountInStore,
        selected: state
      }];
    return result;
  }

  paginatorChanged(event: any): void {
    this.analogHelper.paginator = event ? event : this.initPaginator();
    this.initAnalog();
  }

  initPaginator(): PaginatorResponse {
    const paginator: PaginatorResponse = {
      countStart: 1,
      countFinish: 1,
      countTotal: 1,
      take: 20,
      page: 1,
      pageCount: 1,
      pageSelected: []
    };
    return paginator;
  }

  initAnalog(): void {

    const model: ProductAnalogHelper = {
      analogs: null,
      paginator: this.analogHelper && this.analogHelper.paginator ? this.analogHelper.paginator : this.initPaginator(),
      querry: this.articul,
      tecDocBrandId: this.tecDocBrandId,
      productId: this.product ? this.product.id : null
    };
    this.client.product_GetProductAnalogsResponseResult(model)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.analogHelper = data as ProductAnalogHelper;
        this.analogReady = this.analogHelper.analogs && this.analogHelper.analogs.length > 0;
        this.menuService.paginatorStatusSource.next(this.analogHelper.paginator);
        this.selectedTab.setValue(0);
      }, error => {
        console.error(error);
      });
  }

  initProduct(stringkey: string, code: string, tecDocBrandId: number): void {
    this.client.product_GetProduct(stringkey, code, tecDocBrandId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data.storeProduct) {
          const storeCountExist = data.storeProduct.filter(x => !x.isDelivery && x.count > 0);
          const storeCountDelivery = data.storeProduct.filter(x => x.isDelivery);
          const storeCountZero = data.storeProduct.filter(x => !x.isDelivery && x.count < 1);
          data.storeProduct = storeCountExist.concat(storeCountDelivery).concat(storeCountZero);
        }

        this.product = data as ProductPageResponse;
        this.markChanges();

        this.symbol = "руб.";
        if (this.product.currency) {
          this.symbol = this.product.currency.symbol;
        }

        if (this.product) {
          this.articul = this.product.articul;
          this.tecDocBrandId = this.product.brand.tecDocId;
          this.initTecDocCarMarks();
        }
        this.initAnalog();

        if (!this.product) {
          this.isExist = false;
        }
        let index = -1;
        if (this.storageBasket && this.product.storeProduct && this.product.storeProduct.length > 0) {
          this.product.storeProduct[0].isExpand = true;
          this.product.storeProduct.map(x => {
            index = this.storageBasket.findIndex(y => y.productId === this.product.id && y.storeId === x.store.id);
            if (index > -1) {
              x.countInBasketReload += this.storageBasket[index].count;
            }
          });
        }

        this.initSeo();
        this.initBreadcrumbs();
        if (this.product.images && this.product.images.length > 0) {
          // this.pathImage = AppConfig.settings.storageUrl.url;
          this.initGallery();
        } else {
          if (this.product.tecDocImages && this.product.tecDocImages.length > 0) {
            this.initGallery();
          } else {
            this.pathImage = environment.apiUrl + environment.noPhotoUrl;
            this.galleryImages = [];
          }
        }
        if (this.product.storeProduct) {
          this.createFormControls();
        }
      }, error => {
        this.errorService.redirectError(error.statusCode, 'Товар не найден');
        console.error(error);
      });
  }

  initGallery(): void {
    this.galleryImages = [];

    if (this.product.images && this.product.images.length > 0) {
      for (let i = 0; i < this.product.images.length; i++) {
        this.galleryImages.push(new ImageItem({
          src: environment.productImageUrl + this.product.images[i].originalUrl + '/1200x1000/f=webp',
          thumb: environment.productImageUrl + this.product.images[i].originalUrl + '/100x100/f=webp',
          type: 'image'
        }));
      }
    }

    if (this.product.tecDocImages && this.product.tecDocImages.length > 0) {
      for (let i = 0; i < this.product.tecDocImages.length; i++) {
        this.galleryImages.push(new ImageItem({
          src: environment.apiUrl + this.product.tecDocImages[i],
          thumb: environment.apiUrl + this.product.tecDocImages[i],
          type: 'image'
        }));
      }
    }
  }

  initBreadcrumbs(): void {
    const model: BreadcrumbsLinked[] = [];
    if (this.product && this.product.breadcrumbs) {
      this.product.breadcrumbs.map(x => {
        const prom: BreadcrumbsLinked = {
          title: x.title,
          url: x.url,
          linkType: 2
        };
        model.push(prom);
      });
      model[model.length - 1].linkType = 1;
    }
    const result: Breadcrumbs = {
      title: this.product.title,
      url: `/catalog/${this.product.articul}`,
      links: model,
      linkType: 0
    };
    this.breadcrumbsService.breadcrumbsStatusSource.next(result);
  }
  initSeo(): void {
    const model: TagsInterface[] = [{
      name: 'Description',
      content: this.product.seoDescription ? this.product.seoDescription : this.product.title
    },
    {
      name: 'Keywords',
      content: this.product.seoKeywords ? this.product.seoKeywords : this.product.title
    }];
    const result: SeoInterface = {
      title: this.product.seoTitle ? this.product.seoTitle : this.product.title,
      tags: model
    };
    this.seoService.setSeo(result);
  }

}
