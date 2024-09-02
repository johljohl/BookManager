import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/api/Auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password }).pipe(
      catchError(err => {
        if (err.status === 401) {
          return throwError(() => new Error('Invalid username or password'));
        } else if (err.headers?.get('Token-Expired')) {
          return throwError(() => new Error('Session expired. Please login again.'));
        }
        return throwError(() => new Error('An unknown error occurred. Please try again later.'));
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    this.router.navigate(['/login']); // Navigate to login page
  }
}
