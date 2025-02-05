import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUsers, initializeCollectors } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store) {
    this.store.dispatch(loadUsers());

    this.store.dispatch(initializeCollectors());
  }
}
