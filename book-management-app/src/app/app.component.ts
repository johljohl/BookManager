import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/add-edit-book">Add Book</a>
      <a routerLink="/login">Login</a>
      
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
  `]
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout(); // Call logout method from AuthService
  }
}
