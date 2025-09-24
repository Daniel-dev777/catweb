import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },

  {
    path: 'games',
    loadComponent: () =>
      import('./pages/games/games.component').then(m => m.GamesComponent),
  },

  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },

  { path: '**', redirectTo: '404' },
];
