import { NotificationService } from './notification.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from './authentication/auth.service.service';
import { WishListResponse, Client } from '../../api/client';
import { environment } from '../environments/environment.dev';

@Injectable()
export class WishListService {

  public countWishStatusSource = new BehaviorSubject<number>(0);
  countWishStatus$ = this.countWishStatusSource.asObservable();

  imageNoPhoto = environment.storageUrl + environment.noPhotoUrl;
  imagePath = environment.productImageUrl;

  countWish = 0;

  userWish: WishListResponse;


  constructor(
    private client: Client,
    private authService: AuthService,
    private notify: NotificationService
  ) {
  }

  initBehaviorCount(): void {
    if (this.userWish && this.userWish.items) {
      this.countWish = this.userWish.items.length;
      this.countWishStatusSource.next(this.countWish);
    } else {
      this.countWish = 0;
      this.countWishStatusSource.next(0);
    }
  }

  initImage(): void {
    if (this.userWish && this.userWish.items && this.userWish.items.length > 0) {
      this.userWish.items.map(x => {
        x.product.iconUrl = x.product.iconUrl ? `${x.product.iconUrl}` : this.imageNoPhoto;
      });
    }
  }

  initCount(): void {
    if (this.authService.isLoggedIn()) {
      this.client.wishList_GetWishList().subscribe(data => {
        this.userWish = data as WishListResponse;
        this.initBehaviorCount();
        this.initImage();
      }, error => { console.error(error); });
    }
  }

  addToWishList(model: string[]): void {
    this.client.wishList_AddToWish(model).subscribe(data => {
      this.userWish = data as WishListResponse;
      this.initBehaviorCount();
      this.initImage();
    }, error => {
      console.error(error);
      this.notify.warning('Авторизуйтесь для добавления в избранное', 'Избранное');
    });
  }

  removeFromWishList(model: string[]): void {
    this.client.wishList_RemoveFromWish(model).subscribe(data => {
      model.map(x => {
        const index = this.userWish.items.findIndex(y => y.id === x);
        if (index > -1) {
          if (this.userWish.items[index].product.discountPrice < this.userWish.items[index].product.price) {
            this.userWish.price = this.userWish.price - this.userWish.items[index].product.discountPrice;
          } else {
            this.userWish.price = this.userWish.price - this.userWish.items[index].product.price;
          }
          this.userWish.items.splice(index, 1);
        }
      });
      this.initBehaviorCount();
    }, error => {
      console.error(error);
      this.notify.warning('Авторизуйтесь для добавления в избранное', 'Избранное');
    });
  }

  initWish(isWish: boolean, productId: string, wishId: string): boolean {
    if (!this.authService.isLoggedIn()) {
      this.notify.warning('Авторизуйтесь для добавления в избранное', 'Избранное');
      return false;
    } else {
      const model: string[] = [];
      if (!isWish) {
        model.push(productId);
        this.addToWishList(model);
      } else {
        model.push(wishId);
        this.removeFromWishList(model);
      }
      return !isWish;
    }
  }
}
