import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { VendorDialogComponent } from './vendor-dialog.component';
import { DataGridComponent, DataGridColumn } from '../../shared/data-grid/data-grid.component';

interface Vendor {
  id: number;
  name: string;
  contactInfo: string;
  email?: string;
  phone?: string;
  productCount: number;
}

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, VendorDialogComponent, DataGridComponent],
  template: `
    <div class="page-wrapper">
      <h1 class="page-title"><i class="bi bi-shop"></i> Vendors</h1>
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          @if (auth.isAdmin()) {
            <button class="btn btn-primary mb-4" (click)="openModal()"><i class="bi bi-plus-lg me-1"></i> Add Vendor</button>
          }
          <app-data-grid
            [data]="vendors"
            [columns]="vendorColumns"
            [pageSize]="10"
            [showActions]="auth.isAdmin()"
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
            <app-vendor-dialog [vendor]="editingVendor" (saved)="onSaved()" (cancelled)="showModal=false"></app-vendor-dialog>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  vendorColumns: DataGridColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'contactInfo', label: 'Contact', sortable: true },
    { key: 'productCount', label: 'Products', sortable: true, format: 'number' }
  ];
  showModal = false;
  editingVendor: Vendor | undefined;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<Vendor[]>('vendors').subscribe((v) => (this.vendors = v));
  }

  openModal(vendor?: Vendor) {
    this.editingVendor = vendor;
    this.showModal = true;
  }

  edit(v: Vendor) {
    this.openModal(v);
  }

  onSaved() {
    this.showModal = false;
    this.load();
  }

  delete(v: Vendor) {
    if (confirm('Delete "' + v.name + '"?')) {
      this.api.delete('vendors/' + v.id).subscribe({ next: () => this.load() });
    }
  }
}
