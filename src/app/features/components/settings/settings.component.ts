import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService, UserPreferences } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: UserPreferences = {
    notifications: true,
    darkMode: false,
    language: 'pt-BR',
    currency: 'BRL'
  };

  languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  currencies = [
    { code: 'BRL', name: 'Real (R$)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' }
  ];

  constructor(
    private themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.themeService.getUserPreferences().subscribe(prefs => {
      if (prefs) {
        this.settings = { ...prefs };
      }
    });
  }

  onSave() {
    this.themeService.updatePreferences(this.settings);
    this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['msg-success']
    });
  }

  onReset() {
    this.settings = {
      notifications: true,
      darkMode: false,
      language: 'pt-BR',
      currency: 'BRL'
    };
    this.themeService.updatePreferences(this.settings);
    this.snackBar.open('Configurações restauradas!', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onThemeChange() {
    this.themeService.updatePreferences(this.settings);
  }
} 