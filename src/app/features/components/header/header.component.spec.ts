import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TestModule } from '../../../test.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let router: Router;
  let eventsSubject: Subject<any>;

  beforeEach(async () => {
    eventsSubject = new Subject<any>();
    const routerMock = {
      events: eventsSubject.asObservable(),
      navigate: jasmine.createSpy('navigate')
    };

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['isDarkMode', 'toggleDarkMode']);

    await TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    router = TestBed.inject(Router);

    authService.isAuthenticated.and.returnValue(true);
    themeService.isDarkMode.and.returnValue(of(false));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check authentication status', () => {
    authService.isAuthenticated.and.returnValue(true);
    expect(component.isAuthenticated).toBeTrue();

    authService.isAuthenticated.and.returnValue(false);
    expect(component.isAuthenticated).toBeFalse();
  });

  it('should handle logout', () => {
    authService.logout.and.returnValue();
    component.onLogoutClick();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should toggle dark mode', () => {
    component.toggleDarkMode();
    expect(themeService.toggleDarkMode).toHaveBeenCalled();
  });

  it('should update dark mode state when theme changes', fakeAsync(() => {
    themeService.isDarkMode.and.returnValue(of(true));
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.isDarkMode).toBeTrue();

    themeService.isDarkMode.and.returnValue(of(false));
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(component.isDarkMode).toBeFalse();
  }));

  it('should hide main menu on dashboard route', () => {
    component.currentRoute = '/dashboard';
    expect(component.showMainMenu).toBeFalse();
  });

  it('should show main menu on non-dashboard routes when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.currentRoute = '/summary';
    expect(component.showMainMenu).toBeTrue();
  });

  it('should hide main menu when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    component.currentRoute = '/summary';
    expect(component.showMainMenu).toBeFalse();
  });

  it('should detect summary page', () => {
    component.currentRoute = '/summary';
    expect(component.isOnSummaryPage).toBeTrue();

    component.currentRoute = '/dashboard';
    expect(component.isOnSummaryPage).toBeFalse();
  });

  it('should update current route on navigation', fakeAsync(() => {
    const navigationEnd = new NavigationEnd(1, '/summary', '/summary');
    eventsSubject.next(navigationEnd);
    tick();
    expect(component.currentRoute).toBe('/summary');
  }));
});
