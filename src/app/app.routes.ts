import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfilComponent } from './components/auth/profil/profil.component';
import { HomeComponent } from './components/home/home.component';
import { DemandeComponent } from './components/collecte/demande/demande.component';
import { ListeComponent } from './components/collecte/liste/liste.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profil', component: ProfilComponent },
    { path: 'list', component: ListeComponent },
    { path: 'demande', component: DemandeComponent }
];
