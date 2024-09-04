import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav>
      <a routerLink="/">Booklist</a>
      <a routerLink="/add-edit-book">Add Book</a>
      <a routerLink="/my-quotes">My Quotes</a>
      <a *ngIf="!authService.isAuthenticated()" routerLink="/login">Login</a>
      <a *ngIf="authService.isAuthenticated()" routerLink="/login">Logout</a>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    button {
      margin-left: auto; /* Flytta knappen till slutet av navbar */
    }
  `]
})
export class AppComponent {
  isDarkTheme = false; // Startar med ljus tema

  constructor(public authService: AuthService, private renderer: Renderer2) {
    // Initialt tema baserat på användarens systeminställningar eller tidigare val
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
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
  }
}
