import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/services/auth.service';
import { authInterceptorFn } from './app/interceptors/auth.interceptor';
import { routes } from './app/app.routes';  // Import routes from app.routes.ts

// Bootstrap applikationen med nödvändiga providers
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),  // Use imported routes
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ),
    AuthService,
    // AuthGuard is not needed here if it's used in the route definitions
  ]
}).catch(err => console.error(err));