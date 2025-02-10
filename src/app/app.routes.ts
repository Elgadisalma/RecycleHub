import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfilComponent } from './components/auth/profil/profil.component';
import { HomeComponent } from './components/home/home.component';
import { DemandeComponent } from './components/collecte/demande/demande.component';
import { ListeComponent } from './components/collecte/liste/liste.component';
import { authGuard } from './guards/auth.guard';
import { collectorGuard } from './guards/collector.guard';
import { particulierGuard } from './guards/particulier.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {   path: 'home', 
        component: HomeComponent ,
        canActivate: [authGuard, particulierGuard]
    },

    {   path: 'profil', 
        component: ProfilComponent ,
        canActivate: [authGuard, particulierGuard]
    },

    {   path: 'list', 
        component: ListeComponent ,
        canActivate: [authGuard, collectorGuard]
    },

    {   path: 'demande', 
        component: DemandeComponent ,
        canActivate: [authGuard, particulierGuard]
    }
];
