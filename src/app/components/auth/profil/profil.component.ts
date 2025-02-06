import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { updateUser } from '../../../store/actions/user.actions';
import { UserState } from '../../../store/reducers/user.reducer';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [ReactiveFormsModule, CommonModule],

})

export class ProfilComponent {
  profilForm!: FormGroup;
  currentUser: any;

  constructor(private store: Store<{ users: UserState }>, private fb: FormBuilder) {}

  ngOnInit() {
    this.store.select(state => state.users.currentUser).subscribe(user => {
      this.currentUser = user;

      if (user) {
        // console.log(user); 

        this.profilForm = this.fb.group({
          firstName: [user.firstName],
          lastName: [user.lastName],
          email: [{ value: user.email, disabled: true }],
          address: [user.address],
          phone: [user.phone],
          birthDate: [user.birthDate],
          role: [{ value: user.role, disabled: true }]
        });
      } else {
        // console.log('eerror');
      }
    });
  }

  onSave() {
    if (this.profilForm.valid) {
      const updatedUser = {
        ...this.currentUser,
        ...this.profilForm.getRawValue() 
      };

      this.store.dispatch(updateUser({ updatedUser })); 
      alert('Profil mis à jour avec succès !');
    }
  }
}
