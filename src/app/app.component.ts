import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <a routerLink="/home" class="brand">Missão 3755</a>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
