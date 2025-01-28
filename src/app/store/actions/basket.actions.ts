import { createAction, props } from '@ngrx/store';

export const BasketActions = {
  addItem: createAction('[Basket] Add Item', props<{ item: { productId: string; quantity: number } }>()),
  addFavorite: createAction('[Basket] Add Favorite', props<{ item: { productId: string; quantity: number } }>()),
  removeItem: createAction('[Basket] Remove Item', props<{ productId: string }>()),
};