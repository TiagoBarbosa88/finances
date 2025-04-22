import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { HomeComponent } from './features/components/home/home.component';
import { ProfileComponent } from './features/components/profile/profile.component';
import { SettingsComponent } from './features/components/settings/settings.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionEditComponent } from './features/dashboard/transaction-edit/transaction-edit.component';
import { TransactionInputComponent } from './features/dashboard/transaction-input/transaction-input.component';
import { SummaryComponent } from './features/summary/summary/summary.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transaction/edit/:id', component: TransactionEditComponent },
      { path: 'transaction/add', component: TransactionInputComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
