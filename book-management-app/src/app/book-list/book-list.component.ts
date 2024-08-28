import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books = [
    { id: 1, title: 'Angular Basics', author: 'John Doe' },
    { id: 2, title: 'Advanced Angular', author: 'Jane Smith' }
  ];

  constructor(private router: Router) {}

  addBook() {
    this.router.navigate(['/add-edit-book']);
  }

  editBook(book: any) {
    this.router.navigate(['/add-edit-book', book.id]);
  }

  deleteBook(bookId: number) {
    this.books = this.books.filter(book => book.id !== bookId);
  }
}
