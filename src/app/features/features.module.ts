import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TransactionBalanceComponent } from './dashboard/transaction-balance/transaction-balance.component';
import { HomeComponent } from './components/home/home.component';
import { TransactionInputComponent } from './dashboard/transaction-input/transaction-input.component';
import { TransactionListComponent } from './dashboard/transaction-list/transaction-list.component';
import { TransactionEditComponent } from './dashboard/transaction-edit/transaction-edit.component';
import { TransactionDataComponent } from './dashboard/transaction-data/transaction-data.component';
import { TransactionFilterComponent } from './dashboard/transaction-filter/transaction-filter.component';
import { SummaryComponent } from './summary/summary/summary.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    TransactionBalanceComponent,
    HomeComponent,
    TransactionInputComponent,
    TransactionListComponent,
    TransactionEditComponent,
    TransactionDataComponent,
    TransactionFilterComponent,
    SummaryComponent,
    ProfileComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    HomeComponent,
    TransactionInputComponent,
    TransactionListComponent,
    TransactionEditComponent,
    TransactionDataComponent,
    TransactionFilterComponent,
    SummaryComponent,
    ProfileComponent,
    SettingsComponent
  ]
})
export class FeaturesModule { } 