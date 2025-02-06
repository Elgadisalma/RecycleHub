import { createReducer, on } from '@ngrx/store';
import { registerUser, loadUsers, initializeCollectors, loginUser, updateUser } from '../actions/user.actions';
import { User } from './../../models/user.model';

export interface UserState {
  users: User[];
  currentUser: User | null;
}

const loadUsersFromStorage = (): User[] => JSON.parse(localStorage.getItem('users') || '[]');
const saveUsersToStorage = (users: User[]) => localStorage.setItem('users', JSON.stringify(users));

const loadCurrentUserFromStorage = (): User | null => JSON.parse(localStorage.getItem('currentUser') || 'null');
const saveCurrentUserToStorage = (user: User | null) => localStorage.setItem('currentUser', user ? JSON.stringify(user) : 'null');

// Collecteur
const defaultCollectors: User[] = [
  { id: crypto.randomUUID(), email: 'collector1@example.com', password: 'password123', firstName: 'Collector', lastName: 'One', address: '123 Rue du Recyclage, Paris', phone: '0612345678', birthDate: '1990-01-01', role: 'collecteur' },
  { id: crypto.randomUUID(), email: 'collector2@example.com', password: 'password123', firstName: 'Collector', lastName: 'Two', address: '45 Avenue Verte, Lyon', phone: '0623456789', birthDate: '1985-05-10', role: 'collecteur' },
  { id: crypto.randomUUID(), email: 'collector3@example.com', password: 'password123', firstName: 'Collector', lastName: 'Three', address: '78 Boulevard Durable, Marseille', phone: '0634567890', birthDate: '1992-07-20', role: 'collecteur' }
];


if (!localStorage.getItem('users') || JSON.parse(localStorage.getItem('users') || '[]').length === 0) {
  saveUsersToStorage(defaultCollectors); 
}


const initialState: UserState = {
  users: loadUsersFromStorage(),
  currentUser: loadCurrentUserFromStorage()
};

export const userReducer = createReducer(
  initialState,


  on(loadUsers, state => ({ ...state, users: loadUsersFromStorage() })),


  on(registerUser, (state, { user }) => {
    const updatedUsers = [...state.users, user];
    saveUsersToStorage(updatedUsers);
    return { ...state, users: updatedUsers };
  }),


  on(initializeCollectors, state => {
    const hasCollectors = state.users.some(user => user.role === 'collecteur');
    if (!hasCollectors) {
      const updatedUsers = [...state.users, ...defaultCollectors];
      saveUsersToStorage(updatedUsers);
      return { ...state, users: updatedUsers };
    }
    return state;
  }),


  on(loginUser, (state, { email, password }) => {
    const foundUser = state.users.find(u => u.email === email && u.password === password);
    saveCurrentUserToStorage(foundUser || null); 
    return { ...state, currentUser: foundUser || null };
  }),
  


  on(updateUser, (state, { updatedUser }) => {
    const updatedUsers = state.users.map(user =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    );

    saveUsersToStorage(updatedUsers);
    saveCurrentUserToStorage(updatedUser);

    return { ...state, users: updatedUsers, currentUser: updatedUser };
  })
);
