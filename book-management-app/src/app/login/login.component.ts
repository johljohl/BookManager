import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Ensure necessary modules are imported
  templateUrl: './login.component.html',  // Template for login form
  styleUrls: ['./login.component.css']  // Styles for the login component
})
export class LoginComponent {
  // Object to bind user input (username and password)
  user = { username: '', password: '' };

  // Inject AuthService for authentication and Router for navigation
  constructor(public authService: AuthService, private router: Router) {}

  // Handles the form submission for login
  onSubmit() {
    // Call the AuthService login method to authenticate the user
    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (response) => {
        // If successful, store the JWT token
        this.authService.setToken(response.token);
        // Navigate to the home page
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Show an alert if there's an error (e.g., invalid credentials)
        alert(err.message);
      }
    });
  }

  // Handles user logout
  logout() {
    // Call the AuthService logout method to clear the token
    this.authService.logout();
  }
}
