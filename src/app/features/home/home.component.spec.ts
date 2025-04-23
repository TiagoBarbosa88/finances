import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { User } from '../../../core/models/user.model';
import { TestModule } from '../../../test.module';
import { HomeComponent } from './home.component';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  createdAt: new Date(),
  updatedAt: new Date()
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
      imports: [TestModule],
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
    expect(authService.updateUser).toHaveBeenCalled();
  });
}); 