import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'  // Makes the service globally available across the app
})
export class QuoteService {
  // Base URL for the quote-related API endpoints
  private apiUrl = `${environment.apiUrl}/Quotes`;  // Ensures no double "/api" issue

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Get the token from AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',  // Set content type to JSON
      'Authorization': `Bearer ${token}`  // Attach the JWT token to the Authorization header
    });
  }

  // Fetch all quotes from the backend
  getQuotes(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, { headers: this.getHeaders() });  // GET request with headers
  }

  // Add a new quote to the backend
  addQuote(quote: string): Observable<void> {
    return this.http.post<void>(this.apiUrl, { quote }, { headers: this.getHeaders() });  // POST request to add a new quote
  }

  // Update an existing quote based on its index
  editQuote(index: number, quote: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${index}`, { quote }, { headers: this.getHeaders() });  // PUT request to update a quote
  }

  // Delete a quote based on its index
  deleteQuote(index: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${index}`, { headers: this.getHeaders() });  // DELETE request to remove a quote
  }
}
