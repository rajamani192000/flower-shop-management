import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

interface ApiResponseEnvelope<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (!(event instanceof HttpResponse)) {
          return;
        }

        const body = event.body as ApiResponseEnvelope | null;
        if (!body || typeof body !== 'object') {
          return;
        }

        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
        if (isMutation && body.success !== false) {
          this.notification.showSuccess(body.message || 'Operation completed successfully');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const message =
          error.error?.message ||
          error.error?.error ||
          error.message ||
          'Request failed';
        this.notification.showError(message);
        return throwError(() => error);
      })
    );
  }
}

