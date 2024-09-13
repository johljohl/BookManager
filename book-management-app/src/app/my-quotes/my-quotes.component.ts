import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Required for [(ngModel)]
import { HttpClient } from '@angular/common/http';  // Import HttpClient for API requests
import { QuoteService } from '../services/quote.service';

@Component({
  selector: 'app-my-quotes',
  standalone: true,  // Standalone component importing necessary modules
  imports: [CommonModule, FormsModule],  // Include FormsModule
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.css']
})
export class MyQuotesComponent implements OnInit {
  quotes: string[] = [];  // Array to store the list of quotes
  newQuote: string = '';  // Model for the new or edited quote
  editingIndex: number | null = null;  // Tracks which quote is being edited, if any
  errorMessage: string = '';  // To handle and display errors

  constructor(private http: HttpClient, private quoteService: QuoteService) {}

  // Lifecycle hook that runs once the component has been initialized
  ngOnInit(): void {
    // Fetch quotes from the backend API
    this.http.get<string[]>('https://bookmanager-3.onrender.com/api/quotes')
      .subscribe({
        next: (data) => {
          this.quotes = data;  // Populate the quotes array with fetched data
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to fetch quotes';
          console.error('Error fetching quotes', err);
        }
      });
  }

  // Add a new quote or update an existing one
  addQuote(): void {
    if (this.newQuote.trim()) {  // Ensure the quote is not empty
      if (this.editingIndex !== null) {
        // If in edit mode, update the quote
        this.quoteService.editQuote(this.editingIndex, this.newQuote).subscribe({
          next: () => {
            this.quotes[this.editingIndex!] = this.newQuote;  // Update the local quotes array
            this.newQuote = '';  // Clear the input field
            this.editingIndex = null;  // Reset edit mode
          },
          error: (err: any) => {
            this.errorMessage = 'Failed to edit quote';
            console.error('Error editing quote', err);
          }
        });
      } else {
        // If not in edit mode, add a new quote
        this.quoteService.addQuote(this.newQuote).subscribe({
          next: () => {
            this.quotes.push(this.newQuote);  // Add the new quote to the local array
            this.newQuote = '';  // Clear the input field
          },
          error: (err: any) => {
            this.errorMessage = 'Failed to add quote';
            console.error('Error adding quote', err);
          }
        });
      }
    }
  }

  // Set up the component to edit an existing quote
  editQuote(index: number): void {
    this.newQuote = this.quotes[index];  // Prepopulate the form with the selected quote
    this.editingIndex = index;  // Set the editing index
  }

  // Delete a quote from the backend and local array
  deleteQuote(index: number): void {
    this.quoteService.deleteQuote(index).subscribe({
      next: () => {
        this.quotes.splice(index, 1);  // Remove the quote from the local array
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to delete quote';
        console.error('Error deleting quote', err);
      }
    });
  }

  // Cancel the edit operation and reset the input form
  cancelEdit(): void {
    this.newQuote = '';  // Clear the input field
    this.editingIndex = null;  // Reset the editing state
  }
}
