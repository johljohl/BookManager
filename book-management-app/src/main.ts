import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/book-list/book-list.component';
import { AddEditBookComponent } from './app/add-edit-book/add-edit-book.component';
import { LoginComponent } from './app/login/login.component';
import { AuthGuard } from './app/guards/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: BookListComponent, canActivate: [AuthGuard] },
      { path: 'add-edit-book', component: AddEditBookComponent, canActivate: [AuthGuard] },
      { path: 'add-edit-book/:id', component: AddEditBookComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent }
    ]),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
