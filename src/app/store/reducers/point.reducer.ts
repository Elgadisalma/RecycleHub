import { createReducer, on } from '@ngrx/store';
import { attribuerPoints } from '../actions/collecte.actions';
import { User } from './../../models/user.model';

export interface PointsState {
  users: User[];
}

const loadUsersFromStorage = (): User[] => JSON.parse(localStorage.getItem('users') || '[]');
const saveUsersToStorage = (users: User[]) => localStorage.setItem('users', JSON.stringify(users));

const initialState: PointsState = {
  users: loadUsersFromStorage(),
};

export const pointReducer = createReducer(
  initialState,
  on(attribuerPoints, (state, { clientId, points }) => {
    const updatedUsers = state.users.map(user => {
      if (user.id === clientId) {
        user.points = (user.points || 0) + points;
      }
      return user;
    });
    saveUsersToStorage(updatedUsers); 
    return { ...state, users: updatedUsers };   
  })
);