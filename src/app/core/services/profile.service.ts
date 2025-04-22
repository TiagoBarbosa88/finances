import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
  joinDate: Date;
  totalTransactions: number;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly STORAGE_KEY = 'user_profile';
  private userProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor() {
    this.loadProfile();
  }

  private loadProfile() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      profile.joinDate = new Date(profile.joinDate);
      this.userProfile.next(profile);
    }
  }

  getUserProfile() {
    return this.userProfile.asObservable();
  }

  updateProfile(profile: UserProfile) {
    this.userProfile.next(profile);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
  }

  updatePassword(currentPassword: string, newPassword: string) {
    // Aqui você implementaria a lógica de atualização de senha
    // Normalmente isso envolveria uma chamada à API
    return new Promise<void>((resolve, reject) => {
      // Simulando uma chamada à API
      setTimeout(() => {
        if (currentPassword === 'senha123') { // Exemplo simplificado
          resolve();
        } else {
          reject(new Error('Senha atual incorreta'));
        }
      }, 1000);
    });
  }
} 