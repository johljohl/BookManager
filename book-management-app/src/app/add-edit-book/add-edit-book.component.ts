import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-book.component.html',
  styleUrls: ['./add-edit-book.component.css']
})
export class AddEditBookComponent implements OnInit {
  book = { id: 0, title: '', author: '', publicationDate: '' };  // Initialize with default values
  isEditMode = false;

  constructor(
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.isEditMode = true;
      this.bookService.getBook(+bookId).subscribe({
        next: (book) => (this.book = book),
        error: (err) => console.error('Error fetching book details', err)
      });
    }
  }

  onSubmit() {
    console.log('Book data before POST:', this.book);  // Log to inspect object

    if (this.isEditMode) {
      this.bookService.updateBook(this.book.id!, this.book).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          console.error('Failed to update book', err);
          alert('Failed to update book. Please check the console for details.');
        }
      });
    } else {
      this.bookService.addBook(this.book).subscribe({
        next: () => {
          console.log('Book added successfully');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to add book', err);
          console.error('Validation error from backend:', err.error);  // Log the validation error
          alert('Failed to add book. Validation error occurred. Check input and try again.');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
