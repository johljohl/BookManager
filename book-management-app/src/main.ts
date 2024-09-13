import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';  // <-- Explicitly import Routes type
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/book-list/book-list.component';
import { AddEditBookComponent } from './app/add-edit-book/add-edit-book.component';
import { MyQuotesComponent } from './app/my-quotes/my-quotes.component';
import { LoginComponent } from './app/login/login.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AuthService } from './app/services/auth.service';
import { authInterceptorFn } from './app/interceptors/auth.interceptor';

// Define the routes for the application and explicitly type them as 'Routes'
const routes: Routes = [
  { path: '', redirectTo: '/browser', pathMatch: 'full' },  // Redirect the root path to '/browser'
  { path: 'browser', component: BookListComponent, canActivate: [AuthGuard] },  // Book list route with AuthGuard
  { path: 'add-edit-book', component: AddEditBookComponent, canActivate: [AuthGuard] },  // Add or edit a book, guarded by AuthGuard
  { path: 'add-edit-book/:id', component: AddEditBookComponent, canActivate: [AuthGuard] },  // Edit a specific book by ID, guarded by AuthGuard
  { path: 'my-quotes', component: MyQuotesComponent, canActivate: [AuthGuard] },  // Quotes list, guarded by AuthGuard
  { path: 'login', component: LoginComponent }  // Login page, no guard needed
];

// Bootstrap the application with the required providers
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provide the routes
    provideHttpClient(
      withInterceptors([authInterceptorFn])  // Use the interceptor to handle authentication
    ),
    AuthService,  // Provide the AuthService for authentication handling
    AuthGuard     // Provide the AuthGuard for route protection
  ]
}).catch(err => console.error(err));  // Catch and log errors during application bootstrap
