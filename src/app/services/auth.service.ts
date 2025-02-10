import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUsers, initializeCollectors, logoutUser } from '../store/actions/user.actions';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store, private router: Router) {
    this.store.dispatch(loadUsers());

    this.store.dispatch(initializeCollectors());
  }

  logout() {
    this.store.dispatch(logoutUser());
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}

