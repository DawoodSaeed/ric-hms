import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { MyHospitalTheme } from './core/preset';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    [MessageService],
    [DatePipe],
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    providePrimeNG({
      
      ripple: true,
      theme: {
        preset: MyHospitalTheme,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),

    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Add your custom interceptor here
      multi: true, // Allows multiple interceptors if needed
    },
  ],
};
