import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DataGridComponent, DataGridColumn } from '../../shared/data-grid/data-grid.component';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  topVendors: { vendorId: number; vendorName: string; productCount: number; totalRevenue: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DataGridComponent],
  template: `
    <div class="page-wrapper">
      <h1 class="page-title"><i class="bi bi-speedometer2"></i> Dashboard</h1>
      <div class="row g-3 mb-4">
        <div class="col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center text-white" style="width:52px;height:52px;background:linear-gradient(135deg,#6366f1,#4f46e5)"><i class="bi bi-currency-rupee fs-4"></i></div>
              <div><div class="text-muted small fw-medium">Total Sales</div><div class="fs-4 fw-bold">₹{{ stats?.totalSales | number:'1.2-2' }}</div></div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center text-white" style="width:52px;height:52px;background:linear-gradient(135deg,#10b981,#059669)"><i class="bi bi-bag fs-4"></i></div>
              <div><div class="text-muted small fw-medium">Total Orders</div><div class="fs-4 fw-bold">{{ stats?.totalOrders }}</div></div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center text-white" style="width:52px;height:52px;background:linear-gradient(135deg,#8b5cf6,#7c3aed)"><i class="bi bi-box-seam fs-4"></i></div>
              <div><div class="text-muted small fw-medium">Products</div><div class="fs-4 fw-bold">{{ stats?.totalProducts }}</div></div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center text-white" style="width:52px;height:52px;background:linear-gradient(135deg,#f59e0b,#ef4444)"><i class="bi bi-exclamation-triangle fs-4"></i></div>
              <div><div class="text-muted small fw-medium">Low Stock Alert</div><div class="fs-4 fw-bold text-danger">{{ stats?.lowStockCount }}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom py-3"><h5 class="mb-0"><i class="bi bi-shop text-primary me-2"></i>Top Vendors by Revenue</h5></div>
        <div class="card-body">
          <app-data-grid
            [data]="vendorData"
            [columns]="vendorColumns"
            [pageSize]="5"
            [trackByFn]="vendorTrackBy">
          </app-data-grid>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  vendorData: { vendorId: number; vendorName: string; productCount: number; totalRevenue: number }[] = [];
  vendorColumns: DataGridColumn[] = [
    { key: 'vendorName', label: 'Vendor', sortable: true },
    { key: 'productCount', label: 'Products', sortable: true, format: 'number' },
    { key: 'totalRevenue', label: 'Revenue', sortable: true, format: 'currency' }
  ];
  vendorTrackBy = (_: number, row: any) => row.vendorId;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<DashboardStats>('dashboard/stats').subscribe((s) => {
      this.stats = s;
      this.vendorData = s.topVendors;
    });
  }
}
