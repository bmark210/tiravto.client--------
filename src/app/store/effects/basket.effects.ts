import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BasketActions } from '../actions/basket.actions';

@Injectable()
export class BasketEffects {
  private actions$ = inject(Actions);

  // Example Effect for handling basket changes
  updateBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BasketActions.addItem),
      map((action) => {
        // Implement basket side effects here
        console.log('Basket item added:', action);
        return action;
      }),
      catchError(() => of(BasketActions.removeItem({ productId: '' })))
    )
  );
}