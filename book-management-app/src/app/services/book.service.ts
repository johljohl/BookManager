import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Uppdaterad apiUrl för att undvika "/api/api"-problemet
  private apiUrl = `${environment.apiUrl}/Books`; // Notera att "/api" har tagits bort

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Metod för att få JWT-headern
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Lägg till JWT-token i headern
    });
  }

  // Hämta alla böcker
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Hämta en specifik bok baserat på ID
  getBook(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Lägg till en ny bok
  addBook(book: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, book, { headers: this.getHeaders() });
  }

  // Uppdatera en bok baserat på ID
  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders() });
  }

  // Ta bort en bok baserat på ID
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
