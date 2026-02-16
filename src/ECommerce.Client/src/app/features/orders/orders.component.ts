import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  status: string;
  shippingAddress?: string;
  totalAmount: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-page page-container">
      <div class="page-header">
        <h1>Order History</h1>
        <p>Track and manage your orders</p>
      </div>

      @if (!auth.isLoggedIn()) {
        <div class="card prompt-card">
          <div class="prompt-icon">🔐</div>
          <h3>Sign in to view orders</h3>
          <p>Please sign in to access your order history and tracking information.</p>
          <a routerLink="/login" class="btn-primary">Sign In</a>
        </div>
      } @else if (loading) {
        <div class="loading-spinner"></div>
      } @else if (orders.length === 0) {
        <div class="card empty-state">
          <div class="icon">📋</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <a routerLink="/" class="btn-primary">Start Shopping</a>
        </div>
      } @else {
        <div class="order-list">
          <article *ngFor="let o of orders" class="order-card card">
            <div class="order-header">
              <div class="order-meta">
                <span class="order-id">Order #{{ o.id }}</span>
                <span class="order-date">{{ o.orderDate | date:'mediumDate' }}</span>
              </div>
              <span class="status-badge" [class]="getStatusClass(o.status)">{{ o.status }}</span>
            </div>
            <div class="order-items">
              <div *ngFor="let i of o.items" class="order-item">
                <span class="item-name">{{ i.productName }}</span>
                <span class="item-qty">× {{ i.quantity }}</span>
                <span class="item-price">₹{{ (i.price * i.quantity) | number:'1.2-2' }}</span>
              </div>
            </div>
            <div class="order-footer">
              <span class="order-total">Total: ₹{{ o.totalAmount | number:'1.2-2' }}</span>
            </div>
          </article>
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-page { padding-bottom: 48px; }
    .prompt-card {
      max-width: 480px;
      padding: 48px;
      text-align: center;
    }
    .prompt-icon {
      font-size: 2.5rem;
      margin-bottom: 20px;
      opacity: 0.8;
    }
    .prompt-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 8px;
    }
    .prompt-card p {
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin: 0 0 24px;
    }
    .order-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .order-card {
      padding: 24px;
      transition: box-shadow var(--transition);
    }
    .order-card:hover { box-shadow: var(--shadow-md); }
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .order-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .order-id {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--color-text);
    }
    .order-date {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    .status-badge {
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-radius: 20px;
    }
    .status-badge.delivered {
      background: #d1fae5;
      color: #065f46;
    }
    .status-badge.shipped {
      background: #dbeafe;
      color: #1e40af;
    }
    .status-badge.processing, .status-badge.confirmed {
      background: #fef3c7;
      color: #92400e;
    }
    .status-badge.pending {
      background: #f3f4f6;
      color: #4b5563;
    }
    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }
    .order-items {
      margin-bottom: 16px;
    }
    .order-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      font-size: 0.9375rem;
      color: var(--color-text-muted);
    }
    .item-name { flex: 1; }
    .item-qty { color: var(--color-text-light); }
    .item-price { font-weight: 600; color: var(--color-text); }
    .order-footer {
      padding-top: 16px;
      border-top: 1px solid var(--color-border-light);
    }
    .order-total {
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--color-text);
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loading = true;
      this.api.get<Order[]>('orders').subscribe({
        next: (o) => (this.orders = o),
        complete: () => (this.loading = false)
      });
    }
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase()?.replace(/\s/g, '') || '';
  }
}
