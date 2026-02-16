import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page page-container">
      <div class="page-header">
        <h1>Shopping Cart</h1>
        <p>{{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }} in your cart</p>
      </div>

      @if (cart.items().length > 0) {
        <div class="cart-layout">
          <div class="cart-items card">
            <div *ngFor="let item of cart.items()" class="cart-item">
              <div class="item-image" [style.backgroundImage]="item.imageUrl ? 'url(' + item.imageUrl + ')' : ''">
                <span *ngIf="!item.imageUrl" class="img-placeholder">—</span>
              </div>
              <div class="item-details">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-price">₹{{ item.price | number:'1.2-2' }} each</p>
                <div class="item-actions">
                  <div class="qty-controls">
                    <button type="button" class="qty-btn" (click)="cart.updateQuantity(item.productId, item.quantity - 1)">−</button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button type="button" class="qty-btn" (click)="cart.updateQuantity(item.productId, item.quantity + 1)">+</button>
                  </div>
                  <button type="button" class="btn-remove" (click)="cart.remove(item.productId)">Remove</button>
                </div>
              </div>
              <div class="item-total">₹{{ (item.price * item.quantity) | number:'1.2-2' }}</div>
            </div>
          </div>
          <div class="cart-summary card">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal ({{ cart.count() }} items)</span>
              <span>₹{{ cart.total() | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>₹{{ cart.total() | number:'1.2-2' }}</span>
            </div>
            <a routerLink="/checkout" class="btn-primary btn-checkout">Proceed to Checkout</a>
            <a routerLink="/" class="btn-continue">Continue Shopping</a>
          </div>
        </div>
      } @else {
        <div class="card empty-state">
          <div class="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <a routerLink="/" class="btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page { padding-bottom: 48px; }
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      align-items: start;
    }
    .cart-items { padding: 0; overflow: hidden; }
    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 24px;
      padding: 24px;
      border-bottom: 1px solid var(--color-border-light);
      align-items: center;
    }
    .cart-item:last-child { border-bottom: none; }
    .item-image {
      width: 100px;
      height: 100px;
      background: var(--color-surface-alt);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .item-image[style*="backgroundImage"] {
      background-size: cover;
      background-position: center;
    }
    .img-placeholder {
      font-size: 1.5rem;
      color: var(--color-text-light);
    }
    .item-details { min-width: 0; }
    .item-name {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 4px;
    }
    .item-price {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0 0 12px;
    }
    .item-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .qty-controls {
      display: inline-flex;
      align-items: center;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .qty-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 500;
      background: var(--color-surface);
      border: none;
      cursor: pointer;
      transition: background var(--transition);
    }
    .qty-btn:hover { background: var(--color-surface-alt); }
    .qty-value {
      min-width: 36px;
      text-align: center;
      font-size: 0.9375rem;
      font-weight: 600;
    }
    .btn-remove {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-error);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: opacity var(--transition);
    }
    .btn-remove:hover { opacity: 0.8; }
    .item-total {
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--color-text);
    }
    .cart-summary {
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
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin-bottom: 12px;
    }
    .summary-row.total {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 20px 0;
      padding-top: 16px;
      border-top: 1px solid var(--color-border-light);
    }
    .btn-checkout { width: 100%; margin-bottom: 12px; }
    .btn-continue {
      display: block;
      text-align: center;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-text-muted);
      padding: 12px;
      transition: color var(--transition);
    }
    .btn-continue:hover { color: var(--color-accent); }
    @media (max-width: 900px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-summary { position: static; }
      .cart-item { grid-template-columns: 80px 1fr; gap: 16px; }
      .item-total { grid-column: 2; }
    }
  `]
})
export class CartComponent {
  constructor(public cart: CartService) { }
}
