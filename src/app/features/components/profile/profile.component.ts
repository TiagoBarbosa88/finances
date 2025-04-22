import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = {
    name: 'Usuário Exemplo',
    email: 'usuario@exemplo.com',
    joinDate: new Date('2024-01-01'),
    totalTransactions: 150
  };
} 