import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FooterComponent } from './features/components/footer/footer.component';
import { HeaderComponent } from './features/components/header/header.component';
import { HomeComponent } from './features/components/home/home.component';
import { TransactionBalanceComponent } from './features/dashboard/transaction-balance/transaction-balance.component';
import { TransactionDataComponent } from './features/dashboard/transaction-data/transaction-data.component';
import { TransactionEditComponent } from './features/dashboard/transaction-edit/transaction-edit.component';
import { TransactionFilterComponent } from './features/dashboard/transaction-filter/transaction-filter.component';
import { MaterialModule } from './shared/material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TransactionEditComponent,
    TransactionBalanceComponent,
    TransactionDataComponent,
    TransactionFilterComponent,
  ],
  imports: [
    CommonModule,
    RouterTestingModule,
    HttpClientTestingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule
  ],
  exports: [
    CommonModule,
    RouterTestingModule,
    HttpClientTestingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TransactionEditComponent,
    TransactionBalanceComponent,
    TransactionDataComponent,
    TransactionFilterComponent,
  ]
})
export class TestModule { } 