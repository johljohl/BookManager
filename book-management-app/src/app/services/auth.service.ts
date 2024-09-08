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
  // Auth URL, ensuring no double "/api" issue
  private authUrl = `${environment.apiUrl}/Auth`;
  private tokenExpirationTimer: any;
  private currentToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);  // Store token
          this.startTokenTimer();  // Start the token expiration timer
        }
      }),
      catchError(this.handleError)  // Handle any errors during login
    );
  }

  // Store the token in local storage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.currentToken.next(token);  // Notify subscribers of token change
  }

  // Retrieve the token from local storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Log the user out
  logout(): void {
    localStorage.removeItem('authToken');  // Remove token from local storage
    this.currentToken.next(null);  // Notify subscribers
    clearTimeout(this.tokenExpirationTimer);  // Clear any token timers
    this.router.navigate(['/login']);  // Redirect to login page
  }

  // Start the token expiration timer
  private startTokenTimer() {
    const token = this.getToken();
    if (token) {
      const expirationDate = this.getTokenExpirationDate(token);  // Get expiration date from token
      if (expirationDate) {
        const expiresIn = expirationDate.getTime() - Date.now();
        this.tokenExpirationTimer = setTimeout(() => this.logout(), expiresIn);  // Log out when token expires
      }
    }
  }

  // Decode token to get its expiration date
  private getTokenExpirationDate(token: string): Date | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token
      if (decodedToken.exp === undefined) return null;
      const date = new Date(0);  // Initialize date object
      date.setUTCSeconds(decodedToken.exp);  // Set expiration time
      return date;
    } catch (e) {
      return null;  // Return null if decoding fails
    }
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.error('AuthService: HTTP Error', error);
    if (error.status === 401) {
      return throwError(() => new Error('Invalid username or password'));  // Unauthorized error
    } else if (error.headers?.get('Token-Expired')) {
      return throwError(() => new Error('Session expired. Please login again.'));  // Token expired error
    }
    return throwError(() => new Error('An unknown error occurred. Please try again later.'));  // Generic error
  }

  // Refresh the token
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/refresh`, {}).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);  // Update token
          this.startTokenTimer();  // Restart token expiration timer
        }
      }),
      catchError(this.handleError)  // Handle errors during token refresh
    );
  }
}
