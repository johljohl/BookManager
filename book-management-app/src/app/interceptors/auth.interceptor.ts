import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  // Inject the AuthService to access the token
  const authService = inject(AuthService);

  // Get the current token from AuthService
  const token = authService.getToken();
  
  if (token) {
    console.log('AuthInterceptor: Token found, adding to headers.');
    // Clone the request and add the token to the headers
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Attach the token to the Authorization header
      }
    });
  } else {
    console.log('AuthInterceptor: No token found.');
  }

  // Forward the request and handle potential errors
  return next(req).pipe(
    catchError((error: any) => {
      console.error('AuthInterceptor: HTTP Error occurred', error);

      // Check if the error is a 401 Unauthorized and if the token has expired
      if (error.status === 401 && error.error.message === 'Token expired') {
        console.warn('AuthInterceptor: Token expired, attempting to refresh token.');

        // Attempt to refresh the token using AuthService
        return authService.refreshToken().pipe(
          // If successful, retry the original request with the new token
          switchMap(() => {
            const newToken = authService.getToken();
            if (newToken) {
              console.log('AuthInterceptor: New token obtained, retrying request.');
              // Clone the request with the new token
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
            }
            // Retry the request with the new token
            return next(req);
          }),
          // Handle failure to refresh the token (log the user out)
          catchError(err => {
            console.error('AuthInterceptor: Token refresh failed, logging out.', err);
            authService.logout();  // Log the user out if the refresh fails
            return throwError(() => new Error('Session expired. Please login again.'));
          })
        );
      }

      console.log('AuthInterceptor: Other error occurred, passing it through.');
      // For other errors, pass them along
      return throwError(() => new Error(error.message));
    })
  );
};
