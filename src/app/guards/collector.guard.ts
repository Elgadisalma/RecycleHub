import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { UserState } from '../store/reducers/user.reducer';

export const collectorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store<{ users: UserState }>);

  return store.select(state => state.users.currentUser).pipe(
    take(1),
    map(user => {
      if (user && user.role === 'collecteur') {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};