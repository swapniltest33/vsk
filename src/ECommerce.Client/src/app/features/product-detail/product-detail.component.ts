import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';

interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  subCategoryId?: number;
  subCategoryName?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  vendorId: number;
  vendorName: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detail page-container" *ngIf="product">
      <a routerLink="/" class="back-link">
        <span class="back-arrow">←</span> Back to products
      </a>

      <div class="product-layout">
        <div class="product-gallery">
          <div class="gallery-main" [style.backgroundImage]="product.imageUrl ? 'url(' + product.imageUrl + ')' : ''">
            <span *ngIf="!product.imageUrl" class="gallery-placeholder">No image available</span>
          </div>
        </div>
        <div class="product-info">
          <span class="info-category">{{ product.categoryName }}{{ product.subCategoryName ? ' > ' + product.subCategoryName : '' }}</span>
          <h1 class="info-title">{{ product.name }}</h1>
          <p class="info-price">₹{{ product.price | number:'1.2-2' }}</p>
          <div class="info-meta">
            <span class="meta-item">Sold by {{ product.vendorName }}</span>
            <span class="meta-item stock" [class.low]="product.stock < 10">
              {{ product.stock }} in stock
            </span>
          </div>
          <p class="info-desc">{{ product.description }}</p>

          <div class="add-section">
            <div class="qty-group">
              <label>Quantity</label>
              <div class="qty-controls">
                <button type="button" class="qty-btn" (click)="decrementQty()">−</button>
                <input type="number" [(ngModel)]="qty" min="1" [max]="product.stock" class="qty-input" readonly>
                <button type="button" class="qty-btn" (click)="incrementQty()">+</button>
              </div>
            </div>
            <button
              class="btn-primary btn-add"
              (click)="addToCart()"
              [disabled]="product.stock < 1"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail { padding-bottom: 48px; }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-text-muted);
      text-decoration: none;
      margin-bottom: 24px;
      transition: color var(--transition);
    }
    .back-link:hover { color: var(--color-accent); }
    .back-arrow { font-size: 1.125rem; }
    .product-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }
    .product-gallery {
      position: sticky;
      top: 96px;
    }
    .gallery-main {
      aspect-ratio: 1;
      background: var(--color-surface-alt);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid var(--color-border-light);
    }
    .gallery-main[style*="backgroundImage"] {
      background-size: cover;
      background-position: center;
    }
    .gallery-placeholder {
      font-size: 0.9375rem;
      color: var(--color-text-light);
    }
    .product-info { padding-top: 8px; }
    .info-category {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }
    .info-title {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0 0 16px;
      line-height: 1.3;
    }
    .info-price {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-accent);
      margin: 0 0 20px;
    }
    .info-meta {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .meta-item {
      font-size: 0.9375rem;
      color: var(--color-text-muted);
    }
    .meta-item.stock { font-weight: 500; color: var(--color-success); }
    .meta-item.stock.low { color: var(--color-warning); }
    .info-desc {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--color-text-muted);
      margin: 0 0 32px;
    }
    .add-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .qty-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--color-text);
    }
    .qty-controls {
      display: inline-flex;
      align-items: center;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .qty-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 500;
      background: var(--color-surface);
      border: none;
      cursor: pointer;
      transition: background var(--transition);
    }
    .qty-btn:hover { background: var(--color-surface-alt); }
    .qty-input {
      width: 56px;
      height: 44px;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      background: var(--color-surface);
    }
    .btn-add { width: 100%; max-width: 280px; padding: 16px 24px; font-size: 1rem; }
    @media (max-width: 900px) {
      .product-layout { grid-template-columns: 1fr; }
      .product-gallery { position: static; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  qty = 1;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cart: CartService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<Product>(`products/${id}`).subscribe((p) => (this.product = p));
    }
  }

  decrementQty() {
    this.qty = Math.max(1, this.qty - 1);
  }

  incrementQty() {
    if (this.product) this.qty = Math.min(this.product.stock, this.qty + 1);
  }

  addToCart() {
    if (!this.product || this.product.stock < 1) return;
    this.cart.add(this.product.id, this.product.name, this.product.price, this.qty, this.product.imageUrl);
  }
}
