import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionEditComponent } from './features/dashboard/transaction-edit/transaction-edit.component';
import { TransactionInputComponent } from './features/dashboard/transaction-input/transaction-input.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'transaction/edit/:id', component: TransactionEditComponent },
  { path: 'transaction/add', component: TransactionInputComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
