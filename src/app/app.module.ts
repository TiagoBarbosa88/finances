import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { FeaturesModule } from './features/features.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MaterialModule } from './shared/material.module';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModule,
    AppRoutingModule,
    AuthModule,
    FeaturesModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
