import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  // Update the API URL to match the backend URL
  private apiUrl = 'https://bookmanager-lh64.onrender.com/api/Quotes';

  constructor(private http: HttpClient) {}

  // Fetch all quotes
  getQuotes(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  // Add a new quote
  addQuote(quote: string): Observable<void> {
    return this.http.post<void>(this.apiUrl, { quote });
  }

  // Edit an existing quote
  editQuote(index: number, quote: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${index}`, { quote });
  }

  // Delete a quote by index
  deleteQuote(index: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${index}`);
  }
}
