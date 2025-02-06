import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginUser } from '../../../store/actions/user.actions';
import { UserState } from '../../../store/reducers/user.reducer';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private store: Store<{ users: UserState }>, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onLogin() {
    const { email, password } = this.loginForm.value;

    this.store.select(state => state.users).pipe(take(1)).subscribe(state => {
      const user = state.users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // console.log("successfully logged in");
        
        this.store.dispatch(loginUser({ email, password }));
        localStorage.setItem('currentUser', JSON.stringify(user)); 
        this.router.navigate(['/home']); 
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}