import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ product ? 'Edit' : 'Add' }} Product</h5>
      <button type="button" class="btn-close" (click)="cancelled.emit()"></button>
    </div>
    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" formControlName="name">
        </div>
        <div class="mb-3">
          <label class="form-label">Image URL</label>
          <input type="url" class="form-control" formControlName="imageUrl" placeholder="https://example.com/image.jpg">
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" formControlName="description" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Category</label>
          <select class="form-select" formControlName="categoryId" (change)="onCategoryChange()">
            @for (c of categories; track c.id) { <option [value]="c.id">{{ c.name }}</option> }
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Subcategory</label>
          <select class="form-select" formControlName="subCategoryId">
            <option [value]="null">None</option>
            @for (sc of filteredSubCategories; track sc.id) { <option [value]="sc.id">{{ sc.name }}</option> }
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Price (₹)</label>
          <input type="number" class="form-control" formControlName="price" step="0.01" placeholder="0.00">
        </div>
        <div class="mb-3">
          <label class="form-label">Stock</label>
          <input type="number" class="form-control" formControlName="stock">
        </div>
        <div class="mb-3">
          <label class="form-label">Vendor</label>
          <select class="form-select" formControlName="vendorId">
            @for (v of vendors; track v.id) { <option [value]="v.id">{{ v.name }}</option> }
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="cancelled.emit()">Cancel</button>
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
          @if (saving) { <span class="spinner-border spinner-border-sm me-1"></span> }
          Save
        </button>
      </div>
    </form>
  `,
  styles: []
})
export class ProductDialogComponent implements OnChanges {
  @Input() product?: any;
  @Input() vendors: { id: number; name: string }[] = [];
  @Input() categories: { id: number; name: string }[] = [];
  @Input() subCategories: { id: number; name: string; categoryId: number }[] = [];
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  filteredSubCategories: { id: number; name: string; categoryId: number }[] = [];

  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      imageUrl: [''],
      description: ['', Validators.required],
      categoryId: [0, Validators.required],
      subCategoryId: [null as number | null],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      vendorId: [0, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const p = this.product;
    this.form.patchValue({
      name: p?.name ?? '',
      imageUrl: p?.imageUrl ?? '',
      description: p?.description ?? '',
      categoryId: p?.categoryId ?? (this.categories[0]?.id ?? 0),
      subCategoryId: p?.subCategoryId ?? null,
      price: p?.price ?? 0,
      stock: p?.stock ?? 0,
      vendorId: p?.vendorId ?? (this.vendors[0]?.id ?? 0)
    });
    this.onCategoryChange();
    if (p?.subCategoryId) {
      this.form.get('subCategoryId')?.setValue(p.subCategoryId);
    }
  }

  onCategoryChange() {
    const categoryId = Number(this.form.get('categoryId')?.value);
    this.filteredSubCategories = this.subCategories.filter(sc => sc.categoryId === categoryId);
    if (!this.filteredSubCategories.some(sc => sc.id === this.form.get('subCategoryId')?.value)) {
      this.form.get('subCategoryId')?.setValue(null);
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const body = this.form.value;
    const obs = this.product
      ? this.api.put('products/' + this.product.id, body)
      : this.api.post('products', body);
    obs.subscribe({
      next: () => { this.saved.emit(); this.saving = false; },
      error: () => { this.saving = false; },
      complete: () => { this.saving = false; }
    });
  }
}
