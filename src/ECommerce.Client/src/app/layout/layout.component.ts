import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-inner">
        <a routerLink="/" class="logo">
          <img src="logo.png" alt="VSK Logo" class="logo-img">
          <span class="logo-text">VSK</span>
        </a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Products</a>
          <a routerLink="/cart" routerLinkActive="active" class="nav-link nav-cart">
            <span class="cart-icon">🛒</span>
            Cart
            <span class="cart-badge" *ngIf="cart.count() > 0">{{ cart.count() }}</span>
          </a>
          <a routerLink="/orders" routerLinkActive="active" class="nav-link" *ngIf="auth.isLoggedIn()">Orders</a>
          @if (!auth.isLoggedIn()) {
            <a routerLink="/login" routerLinkActive="active" class="nav-link">Sign In</a>
            <a routerLink="/register" class="btn-nav">Sign Up</a>
          } @else {
            <div class="user-menu">
              <span class="user-name">{{ auth.user()?.name }}</span>
              <button (click)="auth.logout()" class="btn-nav-outline">Logout</button>
            </div>
          }
        </nav>
      </div>
    </header>
    <main class="main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border-light);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--color-text);
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.03em;
    }
    .logo-img {
      height: 32px;
      width: auto;
      object-fit: contain;
    }
    .nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-link {
      padding: 8px 14px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-text-muted);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: color var(--transition), background var(--transition);
    }
    .nav-link:hover { color: var(--color-text); background: var(--color-surface-alt); }
    .nav-link.active { color: var(--color-accent); background: rgba(37, 99, 235, 0.08); }
    .nav-cart {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cart-icon { font-size: 1rem; }
    .cart-badge {
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      background: var(--color-accent);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-nav {
      padding: 10px 18px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: white;
      background: var(--color-accent);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      text-decoration: none;
      transition: background var(--transition);
    }
    .btn-nav:hover { background: var(--color-accent-hover); }
    .btn-nav-outline {
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-muted);
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: border-color var(--transition), color var(--transition);
    }
    .btn-nav-outline:hover { border-color: var(--color-error); color: var(--color-error); }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 8px;
    }
    .user-name {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    .main { min-height: calc(100vh - 64px); }
    @media (max-width: 768px) {
      .header-inner { padding: 0 16px; }
      .nav-link span:not(.cart-badge) { display: none; }
      .user-name { display: none; }
    }
  `]
})
export class LayoutComponent {
  constructor(public auth: AuthService, public cart: CartService) { }
}
