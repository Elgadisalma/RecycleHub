import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';


export const registerUser = createAction(
  '[Auth] Register User',
  props<{ user: User }>()
);


export const loadUsers = createAction('[Auth] Load Users');


export const initializeCollectors = createAction('[Auth] Initialize Collectors');


export const loginUser = createAction(
    '[Auth] Login User',
    props<{ email: string; password: string }>()
);

 
export const updateUser = createAction(
    '[User] Update User',
    props<{ updatedUser: User }>()
);


export const deleteUser = createAction(
    '[User] Delete User',
    props<{ userId: string }>()
  );
  
