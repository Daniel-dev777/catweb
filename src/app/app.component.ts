import { Component, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './app/shared/components/navbar/navbar';

// ajuste este caminho se necessário:

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf, 
    NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // estado reativo para exibir/ocultar
  readonly showNavbar = signal(true);

  // ✅ LISTA CENTRALIZADA: rotas onde a navbar NÃO deve aparecer
  // Suporta curingas: '/auth/**', '/admin/*', '/login'
  private readonly hiddenPatterns: string[] = [];

  constructor(private router: Router, private ar: ActivatedRoute) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = normalizeUrl(this.router.url);
        const shouldHideByPattern = matchesAny(url, this.hiddenPatterns);

        // Também permite ocultar por metadado na rota:
        // { path: 'x', data: { hideNavbar: true }, ... }
        const deepest = getDeepestRoute(this.ar);
        const hideByData = !!deepest.snapshot.data['hideNavbar'];

        this.showNavbar.set(!(shouldHideByPattern || hideByData));
      });
  }
}

/* ----------------- helpers ----------------- */

function normalizeUrl(raw: string): string {
  // remove query/hash e garante barra inicial
  const clean = raw.split('?')[0].split('#')[0];
  return clean.startsWith('/') ? clean : '/' + clean;
}

function getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
  while (route.firstChild) route = route.firstChild;
  return route;
}

// suporta globs simples: ** (qualquer coisa), * (sem barra), case-sensitive
function matchesAny(url: string, patterns: string[]): boolean {
  const normalized = normalizeUrl(url);
  return patterns.some((p) => {
    const pat = normalizeUrl(p);
    const rx = new RegExp(
      '^' +
        pat
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // escapa regex
          .replace(/\*\*/g, '.*')               // ** => qualquer coisa
          .replace(/\*/g, '[^/]*')              // *  => sem barra
      + '$'
    );
    return rx.test(normalized);
  });
}
