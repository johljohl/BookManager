import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ensure imports are correctly referenced
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { username: '', password: '' }; // User object for form binding

  constructor(public authService: AuthService, private router: Router) {} // authService should be public to access in template

  onSubmit() {
    // Use AuthService to authenticate the user
    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token); // Store JWT token
        this.router.navigate(['/']); // Navigate to the home page
      },
      error: (err) => {
        alert(err.message); // Show specific error messages to the user
      }
    });
  }

  logout() {
    this.authService.logout(); // Call logout method from AuthService
  }
}
