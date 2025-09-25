// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { canExitGamesGuard } from './pages/games/games.guard'; // importe o guard aqui

export const routes: Routes = [
  // Página inicial
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  // Home
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },

  // Games (com guard para sair sem salvar)
  {
    path: 'games',
    loadComponent: () =>
      import('./pages/games/games.component').then(m => m.GamesComponent),
    canDeactivate: [canExitGamesGuard], // use o guard importado
  },

  // 404
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },

  // Wildcard
  { path: '**', redirectTo: '404' },
];
