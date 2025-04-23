import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentRoute: string = '';
  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });

    this.themeService.isDarkMode().subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get showMainMenu(): boolean {
    // Se não estiver autenticado, não mostra o menu
    if (!this.isAuthenticated) {
      return false;
    }

    // Lista de rotas onde o menu NÃO deve aparecer
    const hideMenuRoutes = ['/dashboard'];

    // Verifica se a rota atual está na lista de rotas para esconder o menu
    return !hideMenuRoutes.some(route => this.currentRoute.includes(route));
  }

  get isOnSummaryPage(): boolean {
    return this.currentRoute.includes('/summary');
  }

  navigateToHome(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
