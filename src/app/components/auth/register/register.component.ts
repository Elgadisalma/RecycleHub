import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { registerUser } from '../../../store/actions/user.actions';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required]],
      birthDate: ['', Validators.required],
      role: ['particulier']
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      ...this.registerForm.value
    };

    this.store.dispatch(registerUser({ user: newUser }));

    alert('Inscription réussie !');
    this.router.navigate(['/login']);
  }
}
