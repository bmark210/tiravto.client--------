import { createReducer, on } from '@ngrx/store';
import { BasketActions } from '../actions/basket.actions';

export interface BasketState {
  items: Array<{ productId: string; quantity: number }>;
  favorites: Array<{ productId: string; quantity: number }>;
  countBasket: {
    count: number;
    priceTotal: number;
    symbol: string;
  }
}

export const initialBasketState: BasketState = {
  items: [],
  favorites: [],
  countBasket: {
    count: 0,
    priceTotal: 0,
    symbol: 'руб.'
  }
};

export const BASKET_REDUCER = createReducer(
  initialBasketState,
  on(BasketActions.addItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
  })),
  on(BasketActions.addFavorite, (state, { item }) => ({
    ...state,
    favorites: [...state.items, item],
  })),
  on(BasketActions.removeItem, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.productId !== productId),
  }))
);
