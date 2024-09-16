import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { AddEditBookComponent } from './add-edit-book/add-edit-book.component';
import { MyQuotesComponent } from './my-quotes/my-quotes.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: BookListComponent, canActivate: [AuthGuard] },
  { path: 'add-edit-book', component: AddEditBookComponent, canActivate: [AuthGuard] },
  { path: 'add-edit-book/:id', component: AddEditBookComponent, canActivate: [AuthGuard] },
  { path: 'my-quotes', component: MyQuotesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];