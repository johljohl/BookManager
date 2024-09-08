import { Component, Renderer2 } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; // Add RouterModule and Router
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // Include RouterModule
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">BookManager</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" (click)="closeNavbar()">Booklist</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/add-edit-book" (click)="closeNavbar()">Add Book</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/my-quotes" (click)="closeNavbar()">My Quotes</a>
            </li>
            <li class="nav-item" *ngIf="!authService.isAuthenticated()">
              <a class="nav-link" routerLink="/login" (click)="closeNavbar()">Login</a>
            </li>
            <li class="nav-item" *ngIf="authService.isAuthenticated()">
              <a class="nav-link" (click)="logout()">Logout</a> <!-- Logout link -->
            </li>
          </ul>
          <button class="btn btn-outline-secondary" (click)="toggleTheme()">Toggle Theme</button>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet> <!-- Displays routed views -->
  `,
  styles: [`
    .navbar {
      margin-bottom: 20px;
    }
  `]
})
export class AppComponent {
  isDarkTheme = false; // Start with light theme

  constructor(public authService: AuthService, private renderer: Renderer2, private router: Router) {
    // Initialize theme based on local storage or default setting
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    // Listen for route changes to automatically close the navbar after navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeNavbar();
      }
    });
  }

  // Toggle between dark and light theme
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light'); // Save theme to local storage
  }

  // Apply the current theme to the body element
  updateTheme() {
    const theme = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    this.renderer.setAttribute(document.body, 'class', theme); // Set the theme class on the body element
  }

  // Handle logout and close the navbar
  logout() {
    this.authService.logout(); // Call logout method from AuthService
    this.closeNavbar(); // Close navbar after logout
  }

  // Close the navbar after navigation or action
  closeNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar && navbar.classList.contains('show')) {
      const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement; // Ensure HTMLElement usage
      if (navbarToggler) {
        navbarToggler.click(); // Programmatically click the toggler to close the menu
      }
    }
  }
}
