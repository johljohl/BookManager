import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { BookListComponent } from './app/book-list/book-list.component';
import { AddEditBookComponent } from './app/add-edit-book/add-edit-book.component';
import { LoginComponent } from './app/login/login.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: BookListComponent },
      { path: 'add-edit-book', component: AddEditBookComponent },
      { path: 'add-edit-book/:id', component: AddEditBookComponent },
      { path: 'login', component: LoginComponent }
    ])
  ]
}).catch(err => console.error(err));
