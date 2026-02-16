import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="checkout page-container">
      <div class="page-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      @if (!auth.isLoggedIn()) {
        <div class="card prompt-card">
          <div class="prompt-icon">🔐</div>
          <h3>Sign in to checkout</h3>
          <p>Please sign in or create an account to complete your purchase.</p>
          <div class="prompt-actions">
            <a routerLink="/login" [queryParams]="{returnUrl: '/checkout'}" class="btn-primary">Sign In</a>
            <a routerLink="/register" class="btn-outline">Create Account</a>
          </div>
        </div>
      } @else if (cart.items().length === 0) {
        <div class="card empty-state">
          <div class="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products before checking out</p>
          <a routerLink="/" class="btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="checkout-layout">
          <div class="checkout-form card">
            <h3 class="form-title">Shipping Address</h3>
            <form (ngSubmit)="placeOrder()">
              <textarea
                [(ngModel)]="address"
                name="address"
                rows="4"
                class="input-field textarea"
                placeholder="Enter your full shipping address (street, city, state, ZIP)"
              ></textarea>
              <button type="submit" class="btn-primary btn-submit" [disabled]="loading">
                {{ loading ? 'Placing Order...' : 'Place Order' }}
              </button>
            </form>
          </div>
          <div class="checkout-summary card">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-items">
              <div *ngFor="let item of cart.items()" class="summary-item">
                <span class="item-info">{{ item.name }} × {{ item.quantity }}</span>
                <span class="item-price">₹{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
              </div>
            </div>
            <div class="summary-total">
              <span>Total</span>
              <span>₹{{ cart.total() | number:'1.2-2' }}</span>
            </div>
            <a routerLink="/cart" class="btn-edit">Edit Cart</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout { padding-bottom: 48px; }
    .prompt-card {
      max-width: 480px;
      padding: 48px;
      text-align: center;
    }
    .prompt-icon { font-size: 2.5rem; margin-bottom: 20px; opacity: 0.8; }
    .prompt-card h3 { font-size: 1.25rem; font-weight: 600; margin: 0 0 8px; }
    .prompt-card p { font-size: 0.9375rem; color: var(--color-text-muted); margin: 0 0 24px; }
    .prompt-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 32px;
      align-items: start;
    }
    .checkout-form { padding: 28px; }
    .form-title {
      font-size: 1.0625rem;
      font-weight: 600;
      margin: 0 0 20px;
    }
    .textarea {
      min-height: 120px;
      resize: vertical;
      margin-bottom: 24px;
    }
    .btn-submit { width: 100%; padding: 16px; font-size: 1rem; }
    .checkout-summary {
      padding: 24px;
      position: sticky;
      top: 96px;
    }
    .summary-title {
      font-size: 1.0625rem;
      font-weight: 600;
      margin: 0 0 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .summary-items { margin-bottom: 20px; }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 0.9375rem;
      color: var(--color-text-muted);
    }
    .item-price { font-weight: 600; color: var(--color-text); }
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.125rem;
      font-weight: 700;
      padding: 16px 0;
      border-top: 1px solid var(--color-border-light);
    }
    .btn-edit {
      display: block;
      text-align: center;
      margin-top: 16px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-text-muted);
      transition: color var(--transition);
    }
    .btn-edit:hover { color: var(--color-accent); }
    @media (max-width: 900px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .checkout-summary { position: static; }
    }
  `]
})
export class CheckoutComponent {
  address = '';
  loading = false;

  constructor(
    public auth: AuthService,
    public cart: CartService,
    private api: ApiService,
    private router: Router
  ) { }

  placeOrder() {
    if (!this.auth.isLoggedIn() || !this.auth.getToken()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    const items = this.cart.items().map((i) => ({ productId: i.productId, quantity: i.quantity }));
    this.loading = true;
    this.api.post('orders', { items, shippingAddress: this.address || undefined }).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigate(['/orders']);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false)
    });
  }
}
