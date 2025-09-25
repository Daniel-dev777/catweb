// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// se você usa o backend mocado:
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './mocks/in-memory-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(
      InMemoryWebApiModule.forRoot(InMemoryDataService, {
        apiBase: 'api/',
        delay: 300,
      })
    ),
  ],
};
