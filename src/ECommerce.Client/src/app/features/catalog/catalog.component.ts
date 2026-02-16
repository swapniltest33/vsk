import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
}

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
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="catalog page-container">
      <div class="page-header">
        <h1>Products</h1>
        <p>Discover our collection of quality products</p>
      </div>

      <div class="filters card">
        <div class="filters-inner">
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="input-field search-input"
              placeholder="Search products..."
              [(ngModel)]="search"
              (input)="load()"
            >
          </div>
          <select class="input-field category-select" [(ngModel)]="categoryId" (change)="onCategoryChange()">
            <option [value]="0">All Categories</option>
            <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
          </select>
          <select class="input-field category-select" [(ngModel)]="subCategoryId" (change)="load()" [disabled]="!categoryId">
            <option [value]="0">All Subcategories</option>
            <option *ngFor="let sc of filteredSubCategories" [value]="sc.id">{{ sc.name }}</option>
          </select>
        </div>
      </div>

      @if (loading) {
        <div class="loading-spinner"></div>
      } @else if (products.length === 0) {
        <div class="card empty-state">
          <div class="icon">📦</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      } @else {
        <div class="product-grid">
          <article *ngFor="let p of products" class="product-card card">
            <a [routerLink]="['/product', p.id]" class="product-link">
              <div class="product-image" [style.backgroundImage]="p.imageUrl ? 'url(' + p.imageUrl + ')' : ''">
                <span *ngIf="!p.imageUrl" class="image-placeholder">No image</span>
                <span *ngIf="p.stock < 10" class="badge-low">Low stock</span>
              </div>
              <div class="product-body">
                <span class="product-category">{{ p.categoryName }}{{ p.subCategoryName ? ' > ' + p.subCategoryName : '' }}</span>
                <h3 class="product-name">{{ p.name }}</h3>
                <p class="product-desc">{{ p.description | slice:0:90 }}{{ p.description.length > 90 ? '...' : '' }}</p>
                <p class="product-price">₹{{ p.price | number:'1.2-2' }}</p>
              </div>
            </a>
            <button
              class="btn-add"
              (click)="addToCart(p)"
              [disabled]="p.stock < 1"
            >
              {{ p.stock < 1 ? 'Out of stock' : 'Add to Cart' }}
            </button>
          </article>
        </div>
      }
    </div>
  `,
  styles: [`
    .catalog { padding-bottom: 48px; }
    .filters { padding: 20px 24px; margin-bottom: 32px; }
    .filters-inner {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }
    .search-wrap {
      flex: 1;
      min-width: 240px;
      max-width: 400px;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      opacity: 0.6;
    }
    .search-input { padding-left: 44px; }
    .category-select { width: 200px; cursor: pointer; }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .product-card {
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    .product-link {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
    }
    .product-image {
      aspect-ratio: 1;
      background: var(--color-surface-alt);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .product-image[style*="backgroundImage"] {
      background-size: cover;
      background-position: center;
    }
    .image-placeholder {
      font-size: 0.875rem;
      color: var(--color-text-light);
    }
    .badge-low {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      background: var(--color-warning);
      border-radius: 20px;
    }
    .product-body { padding: 20px; }
    .product-category {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .product-name {
      font-size: 1.0625rem;
      font-weight: 600;
      margin: 0 0 8px;
      line-height: 1.4;
      color: var(--color-text);
    }
    .product-desc {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0 0 12px;
      line-height: 1.5;
      flex: 1;
    }
    .product-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-accent);
      margin: 0;
    }
    .btn-add {
      margin: 0 20px 20px;
      padding: 12px;
      font-size: 0.9375rem;
      font-weight: 600;
      font-family: inherit;
      color: white;
      background: var(--color-accent);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background var(--transition);
    }
    .btn-add:hover:not(:disabled) { background: var(--color-accent-hover); }
    .btn-add:disabled {
      background: var(--color-border);
      color: var(--color-text-muted);
      cursor: not-allowed;
    }
  `]
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  filteredSubCategories: SubCategory[] = [];
  categoryId = 0;
  subCategoryId = 0;
  search = '';
  loading = false;

  constructor(private api: ApiService, private cart: CartService) {}

  ngOnInit() {
    this.load();
    this.api.get<Category[]>('categories').subscribe((c) => (this.categories = c));
    this.api.get<SubCategory[]>('subcategories').subscribe((sc) => (this.subCategories = sc));
  }

  onCategoryChange() {
    this.subCategoryId = 0;
    this.filteredSubCategories = this.subCategories.filter(sc => sc.categoryId === Number(this.categoryId));
    this.load();
  }

  load() {
    this.loading = true;
    const params: Record<string, string> = {};
    if (this.categoryId > 0) params['categoryId'] = this.categoryId.toString();
    if (this.subCategoryId > 0) params['subCategoryId'] = this.subCategoryId.toString();
    if (this.search) params['search'] = this.search;
    this.api.get<Product[]>('products', params).subscribe({
      next: (p) => (this.products = p),
      complete: () => (this.loading = false)
    });
  }

  addToCart(p: Product) {
    if (p.stock < 1) return;
    this.cart.add(p.id, p.name, p.price, 1, p.imageUrl ?? undefined);
  }
}
