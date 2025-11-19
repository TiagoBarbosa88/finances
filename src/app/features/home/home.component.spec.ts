import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User, AuthService } from 'src/app/core/auth/services/auth.service';
import { HomeComponent } from '../components/home/home.component';


const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUser']);
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    authServiceSpy.updateUser.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCurrentUser and updateUser', () => {
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalled();
  });
}); 