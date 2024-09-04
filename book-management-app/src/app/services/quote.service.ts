import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = `${environment.apiUrl}/api/Quotes`;

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
