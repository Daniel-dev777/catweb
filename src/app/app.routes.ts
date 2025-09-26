import { Routes } from '@angular/router';

export const routes: Routes = [
  // abre direto na home pública
  { path: '', pathMatch: 'full', redirectTo: 'home-publica' },

  // home-publica: navbar GLOBAL oculta; usamos navbar LOCAL no template
  {
    path: 'home-publica',
    loadComponent: () =>
      import('./pages/home-publica/home-publica').then(m => m.HomePublica),
    data: { hideNavbar: true },
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },


  // demais páginas (exemplos; ajuste como preferir)
  {
    path: 'games',
    loadComponent: () =>
      import('./pages/games/games.component').then(m => m.GamesComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { hideNavbar: true },
  },
  { path: '**', redirectTo: '404' },
];
