import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { username: '', password: '' };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.user.username === 'admin' && this.user.password === 'admin') {
      this.router.navigate(['/']);
    } else {
      alert('Invalid credentials');
    }
  }
}
