import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/book-list/book-list.component';
import { AddEditBookComponent } from './app/add-edit-book/add-edit-book.component';
import { LoginComponent } from './app/login/login.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AuthService } from './app/services/auth.service';
import { authInterceptorFn } from './app/interceptors/auth.interceptor';

// Definiera dina rutter här
const routes = [
  { path: '', component: BookListComponent, canActivate: [AuthGuard] },
  { path: 'add-edit-book', component: AddEditBookComponent, canActivate: [AuthGuard] },
  { path: 'add-edit-book/:id', component: AddEditBookComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

// Bootstrap applikationen med nödvändiga providers
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Ange rutterna
    provideHttpClient(
      withInterceptors([authInterceptorFn]) // Använd den nya interceptor-funktionen
    ),
    AuthService, // Lägg till AuthService
    AuthGuard    // Lägg till AuthGuard
  ]
}).catch(err => console.error(err));
