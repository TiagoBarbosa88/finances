import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Fake user for testing
  private readonly testUser = {
    email: 'test@example.com',
    password: 'Test@123'
  };

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call
    if (email === this.testUser.email && password === this.testUser.password) {
      const user: User = {
        id: 1,
        email: email,
        name: 'Test User'
      };

      return of(user).pipe(
        delay(1000), // Simulate network delay
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
    }
    throw new Error('Invalid credentials');
  }

  register(email: string, password: string, name: string): Observable<User> {
    // Simulate API call
    const user: User = {
      id: 1,
      email,
      name
    };

    return of(user).pipe(
      delay(1000), // Simulate network delay
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 