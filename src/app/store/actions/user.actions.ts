import { createAction, props } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

export const UserActions = {
  loadUser: createAction('[User] Load User'),
  setUser: createAction('[User] Set User', props<{ user: UserState }>()),
  clearUser: createAction('[User] Clear User'),
};