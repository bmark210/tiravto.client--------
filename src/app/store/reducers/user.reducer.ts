import { createReducer, on } from '@ngrx/store';
import { UserActions } from '../actions/user.actions';

export interface UserState {
  id: string | null;
  name: string;
  email: string;
}

export const initialUserState: UserState = {
  id: null,
  name: '',
  email: '',
};

export const USER_REDUCER = createReducer(
  initialUserState,
  on(UserActions.setUser, (state, { user }) => { console.log('setUser'); return { ...state, ...user }}),
  on(UserActions.clearUser, () => { console.log('clearUser');
   return initialUserState})
);