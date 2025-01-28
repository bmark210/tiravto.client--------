import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserActions } from '../actions/user.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);

  // Example Effect for fetching user details
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser), // Triggered only by `loadUser` action
      mergeMap(() =>
        of({ id: '1', name: 'John Doe', email: 'john.doe@example.com' }).pipe(
          map((user) => UserActions.setUser({ user })), // Dispatch `setUser` with new data
          catchError(() => of(UserActions.clearUser()))
        )
      )
    )
  );
}
