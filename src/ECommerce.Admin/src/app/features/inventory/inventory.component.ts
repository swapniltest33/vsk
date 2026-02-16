import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { DataGridComponent, DataGridColumn } from '../../shared/data-grid/data-grid.component';

interface Product {
  id: number;
  name: string;
  stock: number;
  categoryId: number;
  categoryName: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataGridComponent],
  template: `
    <div class="page-wrapper">
      <h1 class="page-title"><i class="bi bi-archive"></i> Inventory Adjustments</h1>
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white"><h5 class="mb-0">Adjust Stock</h5></div>
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="adjust()" class="d-flex flex-wrap gap-3 align-items-end">
            <div class="mb-0">
              <label class="form-label">Product ID</label>
              <input type="number" class="form-control" formControlName="productId" style="width:120px">
            </div>
            <div class="mb-0">
              <label class="form-label">Quantity Change (+/-)</label>
              <input type="number" class="form-control" formControlName="quantityChange" style="width:120px">
            </div>
            <div class="mb-0 flex-grow-1">
              <label class="form-label">Reason</label>
              <input type="text" class="form-control" formControlName="reason" style="min-width:200px">
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">Adjust</button>
          </form>
        </div>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white"><h5 class="mb-0">Low Stock Products</h5></div>
        <div class="card-body">
          <app-data-grid
            [data]="lowStock"
            [columns]="inventoryColumns"
            [pageSize]="10">
          </app-data-grid>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InventoryComponent implements OnInit {
  form: FormGroup;
  lowStock: Product[] = [];
  inventoryColumns: DataGridColumn[] = [
    { key: 'id', label: 'ID', sortable: true, format: 'number' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true, format: 'number' },
    { key: 'categoryName', label: 'Category', sortable: true }
  ];
  saving = false;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.form = this.fb.group({
      productId: [0, [Validators.required, Validators.min(1)]],
      quantityChange: [0, Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLowStock();
  }

  loadLowStock() {
    this.api.get<Product[]>('products').subscribe((p) => {
      this.lowStock = p.filter((x) => x.stock < 10);
    });
  }

  adjust() {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.post('inventory/adjust', this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.loadLowStock();
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }
}
