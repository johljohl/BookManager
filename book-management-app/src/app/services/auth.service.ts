import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/api/Auth`;
  private tokenExpirationTimer: any;
  private currentToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.startTokenTimer();
      }),
      catchError(this.handleError)
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.currentToken.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentToken.next(null);
    clearTimeout(this.tokenExpirationTimer);
    this.router.navigate(['/login']);
  }

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

  private getTokenExpirationDate(token: string): Date | null {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    if (decodedToken.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(() => new Error('Invalid username or password'));
    } else if (error.headers?.get('Token-Expired')) {
      return throwError(() => new Error('Session expired. Please login again.'));
    }
    return throwError(() => new Error('An unknown error occurred. Please try again later.'));
  }

  // Additional method to refresh token if supported
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/refresh`, {}).pipe(
      tap(response => {
        this.setToken(response.token);
        this.startTokenTimer();
      }),
      catchError(this.handleError)
    );
  }
}
