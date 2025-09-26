// Caminho: src/app/shared/components/auth-card/auth-card.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.css'],
})
export class AuthCardComponent {
  activeTab = signal<'login' | 'register'>('login'); // só pra alternar as abas
  setTab(tab: 'login' | 'register') { this.activeTab.set(tab); }
}
