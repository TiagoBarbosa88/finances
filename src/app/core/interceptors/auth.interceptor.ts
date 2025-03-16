import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = 'SEU_TOKEN_AQUI'; // Substitua pelo método de obtenção do token
    let token = localStorage.getItem('token') || ''; 

    if(!token) {
      token = this.generateToken();
      localStorage.setItem('token', token);
    }

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return next.handle(clonedRequest);
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2,12);
  }
}
