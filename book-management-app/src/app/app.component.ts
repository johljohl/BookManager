import { Component, Renderer2 } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router'; // Lägg till RouterModule och Router
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // Lägg till RouterModule här
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
            <a class="nav-link" routerLink="/login" (click)="closeNavbar()">Logout</a>
            </li>
          </ul>
          <button class="btn btn-outline-secondary" (click)="toggleTheme()">Toggle Theme</button>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      margin-bottom: 20px;
    }
  `]
})
export class AppComponent {
  isDarkTheme = false; // Startar med ljus tema

  constructor(public authService: AuthService, private renderer: Renderer2, private router: Router) {
    // Initialt tema baserat på användarens systeminställningar eller tidigare val
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    // Lyssna på navigationshändelser
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeNavbar(); // Stäng navbaren efter navigation
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light'); // Spara tema till lokal lagring
  }

  updateTheme() {
    const theme = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    this.renderer.setAttribute(document.body, 'class', theme); // Uppdatera body-klassen
  }

  logout() {
    this.authService.logout(); // Anropa logout-metoden från AuthService
    this.closeNavbar(); // Stäng navbaren efter utloggning
  }

  closeNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar && navbar.classList.contains('show')) {
      const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement; // Använd HTMLElement
      if (navbarToggler) {
        navbarToggler.click(); // Klicka programatiskt på togglern för att stänga menyn
      }
    }
  }
}


              