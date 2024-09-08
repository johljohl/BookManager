import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Necessary for common directives and form handling
  templateUrl: './add-edit-book.component.html',
  styleUrls: ['./add-edit-book.component.css']
})
export class AddEditBookComponent implements OnInit {
  // Initial model for the book form
  book = { id: 0, title: '', author: '', publicationDate: '' };
  isEditMode = false;  // Determines whether we're editing or adding a book
  isDarkTheme = false;  // Tracks the theme preference

  constructor(
    private bookService: BookService,  // Inject the book service for handling book operations
    private router: Router,  // Router service for navigation
    private route: ActivatedRoute  // ActivatedRoute service to handle route parameters
  ) {
    // Initialize theme status based on saved preference in localStorage
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
  }

  ngOnInit(): void {
    // Get the book ID from the route, if it exists (indicating edit mode)
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.isEditMode = true;
      this.bookService.getBook(+bookId).subscribe({
        next: (book) => (this.book = book),  // If the book exists, populate the form with its data
        error: (err) => console.error('Error fetching book details', err)  // Handle error in book retrieval
      });
    }
  }

  // Submit the form data (either add or edit depending on the mode)
  onSubmit() {
    if (this.isEditMode) {
      // Update the book if in edit mode
      this.bookService.updateBook(this.book.id!, this.book).subscribe({
        next: () => this.router.navigate(['/']),  // Navigate back to the home page on success
        error: (err) => {
          console.error('Failed to update book', err);  // Log any errors to the console
          alert('Failed to update book. Please check the console for details.');  // Show user-friendly alert
        }
      });
    } else {
      // Add a new book if in add mode
      this.bookService.addBook(this.book).subscribe({
        next: () => this.router.navigate(['/']),  // Navigate back on success
        error: (err) => {
          console.error('Failed to add book', err);  // Log any errors
          alert('Failed to add book. Validation error occurred. Check input and try again.');  // User-friendly alert
        }
      });
    }
  }

  // Handle form cancellation and return to the book list
  cancel() {
    this.router.navigate(['/']);
  }
}
