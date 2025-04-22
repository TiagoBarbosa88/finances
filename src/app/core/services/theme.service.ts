import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserPreferences {
  darkMode: boolean;
  language: string;
  currency: string;
  notifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'user_preferences';
  private darkMode = new BehaviorSubject<boolean>(false);
  private userPreferences = new BehaviorSubject<UserPreferences>({
    darkMode: false,
    language: 'pt-BR',
    currency: 'BRL',
    notifications: true
  });

  constructor() {
    this.loadPreferences();
  }

  private loadPreferences() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const preferences = JSON.parse(stored);
      this.userPreferences.next(preferences);
      this.darkMode.next(preferences.darkMode);
      this.updateTheme(preferences.darkMode);
    }
  }

  private updateTheme(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }

  isDarkMode() {
    return this.darkMode.asObservable();
  }

  getUserPreferences() {
    return this.userPreferences.asObservable();
  }

  updatePreferences(preferences: UserPreferences) {
    this.userPreferences.next(preferences);
    this.darkMode.next(preferences.darkMode);
    this.updateTheme(preferences.darkMode);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
  }

  toggleDarkMode() {
    const current = this.userPreferences.value;
    const newPreferences = {
      ...current,
      darkMode: !current.darkMode
    };
    this.updatePreferences(newPreferences);
  }
} 