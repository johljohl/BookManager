import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: any[] = [];

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => (this.books = data),
      error: (err) => console.error('Failed to fetch books', err)
    });
  }

  addBook(): void {
    this.router.navigate(['/add-edit-book']);
  }

  editBook(book: any): void {
    this.router.navigate(['/add-edit-book', book.id]);
  }

  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe({
      next: () => this.fetchBooks(),
      error: (err) => console.error('Failed to delete book', err)
    });
  }
}
