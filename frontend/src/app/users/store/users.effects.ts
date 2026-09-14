import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { loadCurrentUser, loadCurrentUserFailure, loadCurrentUserSuccess } from './users.actions';
import { UsersService } from '../users.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUser),
      switchMap(() =>
        this.usersService.me().pipe(
          map((user) => loadCurrentUserSuccess({ user })),
          catchError((err) =>
            of(loadCurrentUserFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );
}