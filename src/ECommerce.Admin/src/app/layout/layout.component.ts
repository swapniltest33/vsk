import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top px-3">
        <button class="btn btn-link d-lg-none p-0 me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-label="Toggle menu">
          <i class="bi bi-list fs-4"></i>
        </button>
        <a class="navbar-brand d-flex align-items-center gap-2" href="/">
          <i class="bi bi-shop text-primary fs-4"></i>
          <span class="d-none d-md-inline fw-semibold">E-Commerce Admin</span>
        </a>
        <div class="ms-auto d-flex align-items-center gap-2">
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center gap-2 py-2 px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
              <span class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:36px;height:36px;font-size:0.875rem;font-weight:600">{{ userInitial }}</span>
              <span class="d-none d-sm-inline text-dark">{{ auth.user()?.name }}</span>
              <i class="bi bi-chevron-down small"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li class="px-3 py-2 border-bottom">
                <div class="fw-semibold">{{ auth.user()?.name }}</div>
                <small class="text-muted">{{ auth.user()?.email }}</small>
              </li>
              <li>
                <button class="dropdown-item" (click)="auth.logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="sidebar">
        <div class="offcanvas-header border-bottom">
          <h5 class="offcanvas-title d-flex align-items-center gap-2">
            <i class="bi bi-grid-3x3-gap text-primary"></i>
            Admin Panel
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body p-0">
          <nav class="nav flex-column">
            <a class="nav-link d-flex align-items-center gap-2 px-4 py-3" routerLink="/dashboard" routerLinkActive="active bg-primary bg-opacity-10 text-primary" [routerLinkActiveOptions]="{exact:true}" data-bs-dismiss="offcanvas">
              <i class="bi bi-speedometer2"></i> Dashboard
            </a>
            <a class="nav-link d-flex align-items-center gap-2 px-4 py-3" routerLink="/products" routerLinkActive="active bg-primary bg-opacity-10 text-primary" data-bs-dismiss="offcanvas">
              <i class="bi bi-box-seam"></i> Products
            </a>
            <a class="nav-link d-flex align-items-center gap-2 px-4 py-3" routerLink="/vendors" routerLinkActive="active bg-primary bg-opacity-10 text-primary" data-bs-dismiss="offcanvas">
              <i class="bi bi-shop"></i> Vendors
            </a>
            <a class="nav-link d-flex align-items-center gap-2 px-4 py-3" routerLink="/categories" routerLinkActive="active bg-primary bg-opacity-10 text-primary" data-bs-dismiss="offcanvas">
              <i class="bi bi-tags"></i> Categories
            </a>
            <a class="nav-link d-flex align-items-center gap-2 px-4 py-3" routerLink="/orders" routerLinkActive="active bg-primary bg-opacity-10 text-primary" data-bs-dismiss="offcanvas">
              <i class="bi bi-cart3"></i> Orders
            </a>
            <a class="nav-link d-flex align-items-center gap-2 px-4 py-3" routerLink="/inventory" routerLinkActive="active bg-primary bg-opacity-10 text-primary" data-bs-dismiss="offcanvas">
              <i class="bi bi-archive"></i> Inventory
            </a>
          </nav>
        </div>
      </div>

      <div class="d-flex">
        <aside class="sidebar d-none d-lg-block border-end bg-white">
          <div class="sidebar-header px-4 py-3 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-grid-3x3-gap text-primary fs-5"></i>
              <span class="fw-semibold">Admin Panel</span>
            </div>
          </div>
          <nav class="nav flex-column p-3">
            <a class="nav-link rounded d-flex align-items-center gap-2 px-3 py-2 mb-1" routerLink="/dashboard" routerLinkActive="active bg-primary bg-opacity-10 text-primary" [routerLinkActiveOptions]="{exact:true}">
              <i class="bi bi-speedometer2"></i> Dashboard
            </a>
            <a class="nav-link rounded d-flex align-items-center gap-2 px-3 py-2 mb-1" routerLink="/products" routerLinkActive="active bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-box-seam"></i> Products
            </a>
            <a class="nav-link rounded d-flex align-items-center gap-2 px-3 py-2 mb-1" routerLink="/vendors" routerLinkActive="active bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-shop"></i> Vendors
            </a>
            <a class="nav-link rounded d-flex align-items-center gap-2 px-3 py-2 mb-1" routerLink="/categories" routerLinkActive="active bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-tags"></i> Categories
            </a>
            <a class="nav-link rounded d-flex align-items-center gap-2 px-3 py-2 mb-1" routerLink="/orders" routerLinkActive="active bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-cart3"></i> Orders
            </a>
            <a class="nav-link rounded d-flex align-items-center gap-2 px-3 py-2 mb-1" routerLink="/inventory" routerLinkActive="active bg-primary bg-opacity-10 text-primary">
              <i class="bi bi-archive"></i> Inventory
            </a>
          </nav>
        </aside>

        <main class="main-content flex-grow-1">
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout { min-height: 100vh; padding-top: 56px; }
    .navbar { height: 56px; }
    .sidebar {
      width: 280px;
      min-height: calc(100vh - 56px);
      position: sticky;
      top: 56px;
    }
    .main-content { background: #f8fafc; min-height: calc(100vh - 56px); }
    .content { max-width: 1400px; margin: 0 auto; padding: 1.5rem; }
    .nav-link { transition: all 0.15s ease; }
    .nav-link:hover { background: rgba(0,0,0,0.04) !important; }
  `]
})
export class LayoutComponent {
  auth = inject(AuthService);

  get userInitial(): string {
    const name = this.auth.user()?.name;
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
