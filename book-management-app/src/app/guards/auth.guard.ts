import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'  // Makes this service available application-wide without needing to provide it in a specific module
})
export class AuthGuard implements CanActivate {

  // Inject the AuthService to check authentication status and Router for navigation
  constructor(private authService: AuthService, private router: Router) {}

  // Determines whether the route can be activated
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // If the user is authenticated, allow access to the route
      return true;
    } else {
      // If not authenticated, redirect to the login page
      this.router.navigate(['/login']);
      return false;  // Prevent access to the route
    }
  }
}
