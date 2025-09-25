// src/app/pages/games/games.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { GamesComponent } from './games.component';

export const canExitGamesGuard: CanDeactivateFn<GamesComponent> = (component) => {
  return component.canDeactivate();
};
