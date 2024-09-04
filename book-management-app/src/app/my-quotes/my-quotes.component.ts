import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../services/quote.service';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.css']
})
export class MyQuotesComponent implements OnInit {
  quotes: string[] = [];

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (data) => (this.quotes = data),
      error: (err) => console.error('Failed to fetch quotes', err)
    });
  }
}
