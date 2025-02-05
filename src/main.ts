import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router'; 
import { routes } from './app/app.routes';
import { userReducer } from './app/store/reducers/user.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ users: userReducer }),
    provideRouter(routes) 
  ]
}).catch(err => console.error(err));
