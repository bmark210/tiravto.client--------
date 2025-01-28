import { StorageService } from './storage.service';
import { BaseHttpService } from './http/base-http.service';
import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from './authentication/auth.service.service';
import { environment } from '../environments/environment.dev';
import { BasketCityTotalPriceInterface } from '../core/interfaces/basket';
import { BasketCityResponse, BasketCountResponse, BasketItemResponse, BasketRequest, Client } from '../../api/client';

@Injectable()
export class BasketService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public basketCountStatusSource = new BehaviorSubject<BasketCountResponse | null>(null);
  basketCountStatus$ = this.basketCountStatusSource.asObservable();

  public basketCardRemoveStatusSource = new BehaviorSubject<boolean>(false);
  basketCardRemoveStatus$ = this.basketCardRemoveStatusSource.asObservable();

  public basketItemRemoveStatusSource = new BehaviorSubject<boolean>(true);
  basketItemRemoveStatus$ = this.basketItemRemoveStatusSource.asObservable();

  public basketSecondStepChangeStatusSource = new BehaviorSubject<BasketCityResponse | null>(null);
  basketSecondStepChangeStatus$ = this.basketSecondStepChangeStatusSource.asObservable();

  public resetSelectedStatusSource = new BehaviorSubject<boolean>(false);
  resetSelectedStatus$ = this.resetSelectedStatusSource.asObservable();

  public orderPostStatusSource = new BehaviorSubject<boolean>(false);
  orderPostStatus$ = this.orderPostStatusSource.asObservable();

  countBasket: BasketCountResponse = {
    count: 0,
    priceTotal: 0,
    symbol: 'руб.'
  };

    constructor(
        public baseHttpService: BaseHttpService,
        private client: Client,
        private storage: StorageService,
        private authService: AuthService
    ) {
    }

   checkAfterLogin(): void {
    const basket = this.storage.getBasket();
    if (basket.length > 0) {
     this.addToBasket(basket).subscribe(data => {
       this.storage.removeItem(environment.storageProduct);
     }, error => { console.error(error); });
    }
    this.initCount();
  }

    addToBasket(model: BasketRequest[]): Observable<any> {
      return this.client.basket_AddOrUpdateBasket(model);
    }

    initBasket(): Observable<any> {
      const model = this.storage.getBasket();
      return this.client.basket_BasketInfo(model);
    }

    initCount(): void {
      const prom: BasketCountResponse = {
        count: 0,
        priceTotal: 0,
        symbol: 'руб.'
      };
      const basket = this.storage.getBasket();
      if (basket && basket.length > 0) {
        this.client.basket_CheckBasketItemStorage(basket).subscribe( response => {
          if (response && response.length > 0) {
            this.storage.updateBasket(response);
            this.client.basket_BasketCountStorage(response).subscribe(data => {
              const model = data as BasketCountResponse;
              if (this.authService.isLoggedIn()) {
                this.initCountAuth(model);
              } else {
                this.countBasket = model;
                //this.basketCountStatusSource.next(this.countBasket);
              }
            }, error => { console.error(error); });
          } else {
            this.storage.removeItem(environment.storageProduct);
          }
        }, error => { console.error(error); });
      } else {
        if (this.authService.isLoggedIn()) {
          this.initCountAuth(undefined);
        } else {
          this.countBasket = prom;
          //this.basketCountStatusSource.next(this.countBasket);
        }
      }
    }

    initCountAuth(countStorage?: BasketCountResponse): void {
      //this.resetBasketCount();
        this.client.basket_BasketCount().subscribe(data => {
          const model = data as BasketCountResponse;
          if (countStorage) {
            model.count += countStorage.count;
            model.priceTotal += countStorage.priceTotal;
            model.count += countStorage.count;
          }
          this.countBasket = model;
          this.countBasket.symbol = model.symbol;

          this.basketCountStatusSource.next(this.countBasket);
        }, error => { console.error(error); });
    }

    getBasketCount(): BasketCountResponse {
      return this.countBasket;
    }

    calculateBasket(items: BasketItemResponse[]): BasketCityTotalPriceInterface {
      const result: BasketCityTotalPriceInterface = {
        discountValue: 0,
        price: 0
      };
      for (let i = 0; i < items.length; i++) {
        if (items[i].selected) {
          if (items[i].isDiscount || items[i].priceDiscount < items[i].price) {
            result.price += items[i].priceDiscount * items[i].count;
            result.discountValue += (items[i].price - items[i].priceDiscount) * items[i].count;
          } else {
            result.price += items[i].priceDiscount * items[i].count;
          }
        }
      }
      return result;
    }

    resetBasketCount(): void {
      this.countBasket.count = 0;
      this.countBasket.priceTotal = 0;
      this.basketCountStatusSource.next(this.countBasket);
    }
}
