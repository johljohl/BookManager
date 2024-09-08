import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,  // This component is standalone and imports necessary modules
  imports: [HttpClientModule, CommonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  // Holds the list of books fetched from the backend
  books: any[] = [];

  // Inject the BookService for managing book data and Router for navigation
  constructor(private bookService: BookService, private router: Router) {}

  // Lifecycle hook that runs once the component has been initialized
  ngOnInit(): void {
    this.fetchBooks();  // Fetch the list of books when the component initializes
  }

  // Fetch all books from the backend
  fetchBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => (this.books = data),  // On success, populate the books array with the fetched data
      error: (err) => console.error('Failed to fetch books', err)  // Handle any errors that occur
    });
  }

  // Navigate to the add book page
  addBook(): void {
    this.router.navigate(['/add-edit-book']);
  }

  // Navigate to the edit book page with the book's ID as a parameter
  editBook(book: any): void {
    this.router.navigate(['/add-edit-book', book.id]);
  }

  // Delete a book by its ID and refresh the list of books
  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe({
      next: () => this.fetchBooks(),  // After deletion, refresh the list of books
      error: (err) => console.error('Failed to delete book', err)  // Handle any errors that occur
    });
  }
}
