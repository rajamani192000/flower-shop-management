import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ShopContextService } from '../../shop-context.service';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private shopContext: ShopContextService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const shopId = this.shopContext.currentShopId;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (shopId) {
      headers['X-Shop-Id'] = shopId;
    }

    const request = Object.keys(headers).length > 0 ? req.clone({ setHeaders: headers }) : req;
    return next.handle(request);
  }
}
