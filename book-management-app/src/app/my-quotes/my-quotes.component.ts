import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { QuoteService } from '../services/quote.service';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.css']
})
export class MyQuotesComponent implements OnInit {
  quotes: string[] = [];
  newQuote: string = ''; 
  editingIndex: number | null = null;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (data) => (this.quotes = data),
      error: (err: any) => console.error('Failed to fetch quotes', err)
    });
  }

  addQuote(): void {
    if (this.newQuote.trim()) {
      if (this.editingIndex !== null) {
        this.quoteService.editQuote(this.editingIndex, this.newQuote).subscribe({
          next: () => {
            this.quotes[this.editingIndex!] = this.newQuote;
            this.newQuote = '';
            this.editingIndex = null;
          },
          error: (err: any) => console.error('Failed to edit quote', err)
        });
      } else {
        this.quoteService.addQuote(this.newQuote).subscribe({
          next: () => {
            this.quotes.push(this.newQuote);
            this.newQuote = '';
          },
          error: (err: any) => console.error('Failed to add quote', err)
        });
      }
    }
  }

  editQuote(index: number): void {
    this.newQuote = this.quotes[index];
    this.editingIndex = index;
  }

  deleteQuote(index: number): void {
    this.quoteService.deleteQuote(index).subscribe({
      next: () => this.quotes.splice(index, 1),
      error: (err: any) => console.error('Failed to delete quote', err)
    });
  }

  cancelEdit(): void {
    this.newQuote = '';
    this.editingIndex = null;
  }
}
