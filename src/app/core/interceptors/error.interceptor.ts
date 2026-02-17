import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unexpected error occurred';

        if (error.status === 0) {
          message = 'Unable to connect to the server. Please check if the backend is running.';
        } else if (error.status === 404) {
          message = 'The requested resource was not found.';
        } else if (error.status === 400) {
          message = error.error?.message || 'Invalid request. Please check your input.';
        } else if (error.status >= 500) {
          message = 'A server error occurred. Please try again later.';
        }

        this.snackBar.open(message, 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
