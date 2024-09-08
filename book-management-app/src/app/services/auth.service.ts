import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Uppdaterad authUrl för att undvika "/api/api"-problemet
  private authUrl = `${environment.apiUrl}/Auth`;
  private tokenExpirationTimer: any;
  private currentToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient, private router: Router) {}

  // Inloggning
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token); // Sätt token om den finns
          this.startTokenTimer();
        }
      }),
      catchError(this.handleError)
    );
  }

  // Sätt token i lokal lagring
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.currentToken.next(token);
  }

  // Hämta token från lokal lagring
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Kolla om användaren är autentiserad
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logga ut användaren
  logout(): void {
    localStorage.removeItem('authToken');
    this.currentToken.next(null);
    clearTimeout(this.tokenExpirationTimer);
    this.router.navigate(['/login']);
  }

  // Starta token-timer baserat på dess utgångstid
  private startTokenTimer() {
    const token = this.getToken();
    if (token) {
      const expirationDate = this.getTokenExpirationDate(token);
      if (expirationDate) {
        const expiresIn = expirationDate.getTime() - Date.now();
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expiresIn);
      }
    }
  }

  // Hämta utgångsdatumet för token
  private getTokenExpirationDate(token: string): Date | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.exp === undefined) return null;
      const date = new Date(0);
      date.setUTCSeconds(decodedToken.exp);
      return date;
    } catch (e) {
      return null; // Hantera om något går fel med avkodning
    }
  }

  // Hantera fel från HTTP-anrop
  private handleError(error: HttpErrorResponse) {
    console.error('AuthService: HTTP Error', error);
    if (error.status === 401) {
      return throwError(() => new Error('Invalid username or password'));
    } else if (error.headers?.get('Token-Expired')) {
      return throwError(() => new Error('Session expired. Please login again.'));
    }
    return throwError(() => new Error('An unknown error occurred. Please try again later.'));
  }

  // Förnya token om backend stöder det
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/refresh`, {}).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token); // Uppdatera token
          this.startTokenTimer();
        }
      }),
      catchError(this.handleError)
    );
  }
}
