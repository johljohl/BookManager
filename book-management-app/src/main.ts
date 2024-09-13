import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { authInterceptorFn } from './app/interceptors/auth.interceptor';

import { AuthGuard } from './app/guards/auth.guard';
import { AuthService } from './app/services/auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    AuthService,
    AuthGuard,
  ],
}).catch((err) => console.error(err));
