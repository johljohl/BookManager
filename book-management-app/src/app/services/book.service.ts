import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'  // Makes this service available throughout the application
})
export class BookService {
  // Construct the base URL for book-related API requests
  private apiUrl = `${environment.apiUrl}/Books`;  // Note: "/api" has been removed to avoid duplication

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to get headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Get the token from AuthService
    return new HttpHeaders({
      'Content-Type': 'application/json',  // Set content type
      'Authorization': `Bearer ${token}`  // Attach the JWT token to the Authorization header
    });
  }

  // Fetch all books from the backend
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });  // GET request with headers
  }

  // Fetch a single book by its ID
  getBook(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });  // GET request for specific book
  }

  // Add a new book to the backend
  addBook(book: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, book, { headers: this.getHeaders() });  // POST request with book data
  }

  // Update an existing book by its ID
  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders() });  // PUT request to update book
  }

  // Delete a book by its ID
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });  // DELETE request to remove book
  }
}
