import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryProductFullResponse } from '../../../../api/client';
import { environment } from '../../../environments/environment.dev';
import { MenuService } from '../../../services/menu.service';
import { WishListService } from '../../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { IconsCommonComponent } from '../icons-common/icons-common.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-item',
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductItemComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() product: CategoryProductFullResponse;
  @Input() isGrid: boolean;
  @Input() gridType: number;
  @Input() index: number;
  @Input() fixedLine: number;
  @Input() last: boolean;
  @Input() topLabel: string;
  @Input() newLabel: string;
  symbol: string;

  pathImage: string = environment.storageUrl + environment.noPhotoUrl;
  readonly optimizePoint: string = '/500x500/f=webp'

  productInLine = 5;

  isHover = false;

  btnInfo = 'Купить';
  countInfo = 'Есть в наличии';

  constructor(
    private menuService: MenuService,
    private router: Router,
    private wishListService: WishListService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.wishListService.countWishStatus$
    .pipe( takeUntil(this.ngUnsubscribe) )
    .subscribe(data => {
      if (this.wishListService.userWish) {
        const i = this.wishListService.userWish.items.findIndex(x => x.product.id === this.product.id);
        if (i > -1) {
          this.product.wishItemId = this.wishListService.userWish.items[i].id;
        }
      }
    });
    if (this.fixedLine > -1) {
      this.productInLine = this.fixedLine;
    } else {
      this.menuService.productWidthStatus$
      .pipe( takeUntil(this.ngUnsubscribe) )
      .subscribe(data => {
        if (data) {
          this.productInLine = data;
        }
      });
    }
    if (!this.product.countInfo) {
      this.btnInfo = 'Аналоги';
      this.countInfo = 'Нет в наличии';
    }
    if (this.product.isDelivery && this.product.countInfo){
      this.btnInfo = 'Под заказ';
    }
    const index = this.product.images.findIndex(x => x.isMain);

    if(this.product.images[index]?.originalUrl.length) {
      this.pathImage = environment.productImageUrl + this.product.images[index]?.originalUrl + this.optimizePoint;
    } else if (this.product.images[0]?.originalUrl.length) {
      this.pathImage = environment.productImageUrl + this.product.images[0]?.originalUrl + this.optimizePoint;
    }

    this.initSymbol();
    // if (this.isGrid) {
    //   this.menuService.gridTypeStatus$.subscribe(type => {
    //     if (type !== this.gridType) {
    //       this.gridType = type;
    //     }
    //   });
    // }
    // this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showModal(): void {
    if (this.menuService.productModalShow && this.product.countInfo) {
      const productModal = this.menuService.getProductModal(
        this.product.stringKey,
        true,
        this.product.articul,
        this.product.brand.tecDocId);
      this.menuService.productModalStatusSource.next(productModal);
    } else {
      this.router.navigate([`/product/${this.product.stringKey}`]);
    }
  }

  initWish(): void {
    this.product.isWish = this.wishListService.initWish(this.product.isWish, this.product.id, this.product.wishItemId);
  }

  initSymbol(): void {
    if (this.product.currency === environment.currency.PRB.code) {
      this.symbol = environment.currency.PRB.symbol;
    }
    if (this.product.currency === environment.currency.USD.code) {
      this.symbol = environment.currency.USD.symbol;
    }
  }
}
