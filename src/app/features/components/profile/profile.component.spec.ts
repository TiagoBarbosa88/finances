import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../../shared/material.module';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default user data', () => {
    expect(component.user).toBeDefined();
    expect(component.user.name).toBe('Usuário Exemplo');
    expect(component.user.email).toBe('usuario@exemplo.com');
    expect(component.user.joinDate).toEqual(new Date('2024-01-01'));
    expect(component.user.totalTransactions).toBe(150);
  });

  it('should display user information in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('mat-card-title')?.textContent).toContain(component.user.name);
    expect(compiled.querySelector('mat-card')?.textContent).toContain(component.user.email);
    expect(compiled.querySelector('mat-card')?.textContent).toContain('150');
  });

  it('should format join date correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const formattedDate = new Date('2024-01-01').toLocaleDateString();

    expect(compiled.querySelector('mat-card')?.textContent).toContain(formattedDate);
  });
}); 