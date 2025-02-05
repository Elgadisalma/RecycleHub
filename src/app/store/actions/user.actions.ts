import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Ajouter un utilisateur
export const registerUser = createAction(
  '[Auth] Register User',
  props<{ user: User }>()
);

// Charger les utilisateurs depuis le localStorage
export const loadUsers = createAction('[Auth] Load Users');

// Initialiser des collecteurs par défaut
export const initializeCollectors = createAction('[Auth] Initialize Collectors');
