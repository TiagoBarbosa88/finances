import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token') || '';

    if (!token) {
      token = this.generateToken();
      localStorage.setItem('token', token);
    }

    // Apenas adiciona headers de autenticação e content-type
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(clonedRequest);
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}
