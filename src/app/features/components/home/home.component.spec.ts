import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService, User } from '../../../core/auth/services/auth.service';
import { TestModule } from '../../../test.module';
import { HomeComponent } from './home.component';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com'
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'login', 'register', 'isAuthenticated']);
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.login.and.returnValue(of(mockUser));
    authServiceSpy.register.and.returnValue(of(mockUser));
    authServiceSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [TestModule, ReactiveFormsModule],
      declarations: [HomeComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login and register forms', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.registerForm).toBeDefined();
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('name')).toBeTruthy();
    expect(component.registerForm.contains('email')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('confirmPassword')).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTruthy();

    email.setValue('valid@email.com');
    expect(email.valid).toBeTruthy();
  });

  it('should validate password length', () => {
    const password = component.loginForm.controls['password'];
    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('12345');
    expect(password.hasError('minlength')).toBeTruthy();

    password.setValue('123456');
    expect(password.valid).toBeTruthy();
  });

  it('should validate password match in register form', () => {
    const registerForm = component.registerForm;
    registerForm.controls['password'].setValue('123456');
    registerForm.controls['confirmPassword'].setValue('123456');
    expect(registerForm.hasError('mismatch')).toBeFalsy();

    registerForm.controls['confirmPassword'].setValue('different');
    expect(registerForm.hasError('mismatch')).toBeTruthy();
  });

  it('should redirect to dashboard if already authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect if not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle successful login', fakeAsync(() => {
    authService.login.and.returnValue(of({}));
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.onLogin();
    tick();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.error).toBe('');
  }));

  it('should handle login error', fakeAsync(() => {
    const errorMessage = 'Invalid credentials';
    authService.login.and.returnValue(throwError(() => new Error(errorMessage)));
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.onLogin();
    tick();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  }));

  it('should handle successful registration', fakeAsync(() => {
    authService.register.and.returnValue(of({}));
    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onRegister();
    tick();

    expect(authService.register).toHaveBeenCalledWith('test@example.com', '123456', 'Test User');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.error).toBe('');
  }));

  it('should handle registration error', fakeAsync(() => {
    const errorMessage = 'Registration failed';
    authService.register.and.returnValue(throwError(() => new Error(errorMessage)));
    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onRegister();
    tick();

    expect(authService.register).toHaveBeenCalledWith('test@example.com', '123456', 'Test User');
    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  }));

  it('should get current user on init', () => {
    expect(authService.getCurrentUser).toHaveBeenCalled();
  });

  it('should handle login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    component.login(credentials);
    expect(authService.login).toHaveBeenCalledWith(credentials.email, credentials.password);
  });

  it('should handle register', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    component.register(userData);
    expect(authService.register).toHaveBeenCalledWith(userData.email, userData.password, userData.name);
  });
});
