import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { MaterialModule } from '../../../shared/material.module';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const defaultPreferences = {
    notifications: true,
    darkMode: false,
    language: 'pt-BR',
    currency: 'BRL'
  };

  beforeEach(() => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['getUserPreferences', 'updatePreferences']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [SettingsComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    themeService.getUserPreferences.and.returnValue(of(defaultPreferences));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default settings', () => {
    expect(component.settings).toEqual(defaultPreferences);
    expect(themeService.getUserPreferences).toHaveBeenCalled();
  });

  it('should have predefined language options', () => {
    expect(component.languages).toContain(jasmine.objectContaining({
      code: 'pt-BR',
      name: 'Português (Brasil)'
    }));
    expect(component.languages).toContain(jasmine.objectContaining({
      code: 'en',
      name: 'English'
    }));
    expect(component.languages).toContain(jasmine.objectContaining({
      code: 'es',
      name: 'Español'
    }));
  });

  it('should have predefined currency options', () => {
    expect(component.currencies).toContain(jasmine.objectContaining({
      code: 'BRL',
      name: 'Real (R$)'
    }));
    expect(component.currencies).toContain(jasmine.objectContaining({
      code: 'USD',
      name: 'US Dollar ($)'
    }));
    expect(component.currencies).toContain(jasmine.objectContaining({
      code: 'EUR',
      name: 'Euro (€)'
    }));
  });

  it('should save settings and show success message', fakeAsync(() => {
    const newSettings = {
      ...defaultPreferences,
      darkMode: true,
      language: 'en'
    };
    component.settings = newSettings;

    component.onSave();
    tick();

    expect(themeService.updatePreferences).toHaveBeenCalledWith(newSettings);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Configurações salvas com sucesso!',
      'Fechar',
      jasmine.any(Object)
    );
  }));

  it('should reset settings to default values', fakeAsync(() => {
    component.settings = {
      notifications: false,
      darkMode: true,
      language: 'en',
      currency: 'USD'
    };

    component.onReset();
    tick();

    expect(component.settings).toEqual(defaultPreferences);
    expect(themeService.updatePreferences).toHaveBeenCalledWith(defaultPreferences);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Configurações restauradas!',
      'Fechar',
      jasmine.any(Object)
    );
  }));

  it('should update theme when dark mode is toggled', fakeAsync(() => {
    component.settings.darkMode = true;
    component.onThemeChange();
    tick();

    expect(themeService.updatePreferences).toHaveBeenCalledWith(component.settings);
  }));
}); 