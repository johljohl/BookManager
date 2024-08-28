import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-book.component.html',
  styleUrls: ['./add-edit-book.component.css']
})
export class AddEditBookComponent {
  book = { id: null as number | null, title: '', author: '' };
  isEditMode = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.isEditMode = true;
      // Fetch the book details from a service or state management
      this.book = { id: parseInt(bookId, 10), title: 'Sample Book', author: 'Sample Author' };
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // Update the book logic here
    } else {
      // Add new book logic here
    }
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
