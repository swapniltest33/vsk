import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ProductDialogComponent } from './product-dialog.component';
import { DataGridComponent, DataGridColumn } from '../../shared/data-grid/data-grid.component';

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
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductDialogComponent, DataGridComponent],
  template: `
    <div class="page-wrapper">
      <h1 class="page-title"><i class="bi bi-box-seam"></i> Products</h1>
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
            <button class="btn btn-primary" (click)="openModal()">
              <i class="bi bi-plus-lg me-1"></i> Add Product
            </button>
            <form [formGroup]="filterForm" class="d-flex flex-wrap gap-2 flex-grow-1">
              <select class="form-select" style="width:auto;min-width:140px" formControlName="categoryId" (change)="onCategoryChange()">
                <option [value]="0">All Categories</option>
                @for (c of categories; track c.id) { <option [value]="c.id">{{ c.name }}</option> }
              </select>
              <select class="form-select" style="width:auto;min-width:140px" formControlName="subCategoryId" [disabled]="!filterForm.get('categoryId')?.value">
                <option [value]="0">All Subcategories</option>
                @for (sc of filteredSubCategories; track sc.id) { <option [value]="sc.id">{{ sc.name }}</option> }
              </select>
              <input type="text" class="form-control" style="width:200px" formControlName="search" placeholder="Search...">
              <button type="button" class="btn btn-outline-secondary" (click)="load()">Filter</button>
            </form>
          </div>
          <app-data-grid
            [data]="products"
            [columns]="productColumns"
            [pageSize]="10"
            [showActions]="true"
            (onEdit)="edit($event)"
            (onDelete)="delete($event)">
          </app-data-grid>
        </div>
      </div>
    </div>

    @if (showModal) {
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <app-product-dialog
              [product]="editingProduct"
              [vendors]="vendors"
              [categories]="categories"
              [subCategories]="subCategories"
              (saved)="onSaved()"
              (cancelled)="showModal=false">
            </app-product-dialog>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productColumns: DataGridColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'categoryName', label: 'Category', sortable: true },
    { key: 'subCategoryName', label: 'Subcategory', sortable: true },
    { key: 'price', label: 'Price', sortable: true, format: 'currency' },
    { key: 'stock', label: 'Stock', sortable: true, format: 'number' },
    { key: 'vendorName', label: 'Vendor', sortable: true }
  ];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  filteredSubCategories: SubCategory[] = [];
  vendors: { id: number; name: string }[] = [];
  filterForm: FormGroup;
  showModal = false;
  editingProduct: Product | undefined;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.filterForm = this.fb.nonNullable.group({ categoryId: [0], subCategoryId: [0], search: [''] });
  }

  ngOnInit() {
    this.load();
    this.api.get<Category[]>('categories').subscribe((c) => (this.categories = c));
    this.api.get<SubCategory[]>('subcategories').subscribe((sc) => (this.subCategories = sc));
    this.api.get<{ id: number; name: string }[]>('vendors').subscribe((v) => (this.vendors = v));
  }

  onCategoryChange() {
    this.filterForm.get('subCategoryId')?.setValue(0);
    const categoryId = Number(this.filterForm.get('categoryId')?.value);
    this.filteredSubCategories = this.subCategories.filter(sc => sc.categoryId === categoryId);
    this.load();
  }

  load() {
    const { categoryId, subCategoryId, search } = this.filterForm.value;
    const params: Record<string, string> = {};
    if (categoryId > 0) params['categoryId'] = categoryId.toString();
    if (subCategoryId > 0) params['subCategoryId'] = subCategoryId.toString();
    if (search) params['search'] = search;
    this.api.get<Product[]>('products', params).subscribe((p) => (this.products = p));
  }

  openModal(product?: Product) {
    this.editingProduct = product;
    this.showModal = true;
  }

  edit(p: Product) {
    this.openModal(p);
  }

  onSaved() {
    this.showModal = false;
    this.load();
  }

  delete(p: Product) {
    if (confirm('Delete "' + p.name + '"?')) {
      this.api.delete('products/' + p.id).subscribe({ next: () => this.load() });
    }
  }
}
