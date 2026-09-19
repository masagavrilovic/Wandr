import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { selectInitialized, selectIsAuthenticated } from './store/auth.selectors';

function authenticated$() {
  const store = inject(Store);
  return combineLatest([
    store.select(selectInitialized),
    store.select(selectIsAuthenticated),
  ]).pipe(
    filter(([initialized]) => initialized),
    take(1),
    map(([, isAuth]) => isAuth),
  );
}

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  return authenticated$().pipe(
    map((isAuth) =>
      isAuth
        ? true
        : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }),
    ),
  );
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  return authenticated$().pipe(
    map((isAuth) => (isAuth ? router.createUrlTree(['/dashboard']) : true)),
  );
};