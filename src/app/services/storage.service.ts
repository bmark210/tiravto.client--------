import { BasketService } from './basket.service';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError as observableThrowError, BehaviorSubject, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { BasketRequest } from '../../api/client';
import { environment } from '../environments/environment.dev';

@Injectable()
export class StorageService {

  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {

   }

   test(): void {
    window.localStorage.setItem('test', 'testPhrase');
   }

   addProducts(products: BasketRequest[]): void {
    // const basket = this.getBasket();
    // this.setProduct(basket, products);
   }

   removeProduct(product: BasketRequest): boolean {
    const basket = this.getBasket();
    const index = basket.findIndex(x => x.productId === product.productId && x.storeId === product.storeId);
    if (index < 0) {
      return false;
    }
    basket.splice(index, 1);
    const result = JSON.stringify(basket);
    window.localStorage.setItem(environment.storageProduct, result);
    return true;
   }

   changeBasketProductCount(product: BasketRequest): boolean {
    const basket = this.getBasket();
    const index = basket.findIndex(x => x.productId === product.productId && x.storeId === product.storeId);
    if (index > -1) {
      basket[index].count = product.count;
      const result = JSON.stringify(basket);
      window.localStorage.setItem(environment.storageProduct, result);
      return true;
    }
    return false;
   }

   updateRemainder(): void {
    const remainder: BasketRequest[] = [];
    const basket = this.getBasket();
    if (!basket) {
      return;
    }
    basket.map(x => {
      if (!x.selected){
        remainder.push(x);
      }
    });
    if (remainder.length === 0) {
      this.removeItem(environment.storageProduct);
    } else {
      const result = JSON.stringify(remainder);
      window.localStorage.setItem(environment.storageProduct, result);
    }
   }

   updateBasket(basket: BasketRequest[]): void {
    this.localStorage.removeItem(environment.storageProduct);
    const result = JSON.stringify(basket);
    window.localStorage.setItem(environment.storageProduct, result);
   }

   getBasket(): BasketRequest[] {
    const basketJson = this.getItem(environment.storageProduct);
    let basket: BasketRequest[] = [];
    if (basketJson) {
      basket = JSON.parse(basketJson) as BasketRequest[];
    }
    return basket;
   }

   changeSelected(storeId: number, productId: string, state: boolean): void {
    const basketJson = this.getItem(environment.storageProduct);
    let basket: BasketRequest[] = [];
    if (!basketJson) {
      return;
    }
    basket = JSON.parse(basketJson) as BasketRequest[];
    const index = basket.findIndex(x => x.productId === productId && x.storeId === storeId);
    if (index < 0) {
      return;
    }
    basket[index].selected = state;
    const result = JSON.stringify(basket);
    window.localStorage.setItem(environment.storageProduct, result);
   }

   setProduct(basket: BasketRequest[], products: BasketRequest[]): void {
    // const updateBasket = this.basketDistinct(basket.concat(products));
    // const result = JSON.stringify(updateBasket);
    // window.localStorage.setItem(environment.storageProduct, result);
    // this.notify.success('Товар добавлен в корзину', 'Корзина');
   }

   removeItem(key: string): void {
    this.localStorage.removeItem(key);
   }

   getItem(key: string): string {
    if (this.localStorage != null) {
      return localStorage.getItem(key);
    } else {
      return null;
    }
   }

   basketDistinct(basket: BasketRequest[]): BasketRequest[] {
    const result: BasketRequest[] = [];
    for (let i = 0; i < basket.length; i++) {
      const indexResult = result.findIndex(x => x.productId === basket[i].productId && x.storeId === basket[i].storeId);
      if (indexResult < 0) {
        const prom = basket.filter(x => x.productId === basket[i].productId && x.storeId === basket[i].storeId);
        const maxCount = Math.max.apply(Math, prom.map(function(o) { return o.maxCountInStore; }));
        const count = prom.map(x => x.count).reduce((x, y) => Number(x) + Number(y));
        result.push({
            productId: basket[i].productId,
            storeId: basket[i].storeId,
            count: count > maxCount ? maxCount : count,
            maxCountInStore: basket[i].maxCountInStore,
            selected: basket[i].selected
          });
      }
    }
    return result;
   }

}
