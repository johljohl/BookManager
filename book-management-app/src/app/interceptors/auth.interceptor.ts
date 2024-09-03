import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injicera AuthService

  const token = authService.getToken();
  if (token) {
    console.log('AuthInterceptor: Token found, adding to headers.');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('AuthInterceptor: No token found.');
  }

  return next(req).pipe(
    catchError((error: any) => {
      console.error('AuthInterceptor: HTTP Error occurred', error);

      if (error.status === 401 && error.error.message === 'Token expired') {
        console.warn('AuthInterceptor: Token expired, attempting to refresh token.');

        // Token har gått ut, försök att förnya den
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getToken();
            if (newToken) {
              console.log('AuthInterceptor: New token obtained, retrying request.');
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
            }
            return next(req);
          }),
          catchError(err => {
            console.error('AuthInterceptor: Token refresh failed, logging out.', err);
            authService.logout();
            return throwError(() => new Error('Session expired. Please login again.'));
          })
        );
      }

      console.log('AuthInterceptor: Other error occurred, passing it through.');
      return throwError(() => new Error(error.message));
    })
  );
};
