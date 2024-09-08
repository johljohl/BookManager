import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  // Uppdaterad apiUrl för att undvika "/api/api"-problemet
  private apiUrl = `${environment.apiUrl}/Quotes`; // Notera att "/api" har tagits bort

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Metod för att få JWT-headern
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Lägg till JWT-token i headern
    });
  }

  // Hämta alla citat
  getQuotes(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Lägg till ett nytt citat
  addQuote(quote: string): Observable<void> {
    return this.http.post<void>(this.apiUrl, { quote }, { headers: this.getHeaders() });
  }

  // Uppdatera ett specifikt citat baserat på index
  editQuote(index: number, quote: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${index}`, { quote }, { headers: this.getHeaders() });
  }

  // Ta bort ett specifikt citat baserat på index
  deleteQuote(index: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${index}`, { headers: this.getHeaders() });
  }
}
