import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <h1 class="page-title"><i class="bi bi-cart3"></i> Orders</h1>
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="mb-4">
            <select class="form-select d-inline-block w-auto" [(ngModel)]="statusFilter" (ngModelChange)="load()">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th><a href="javascript:void(0)" class="text-decoration-none text-dark" (click)="sortBy('id')">ID</a></th>
                  <th><a href="javascript:void(0)" class="text-decoration-none text-dark" (click)="sortBy('userName')">Customer</a></th>
                  <th><a href="javascript:void(0)" class="text-decoration-none text-dark" (click)="sortBy('orderDate')">Date</a></th>
                  <th>Status</th>
                  <th><a href="javascript:void(0)" class="text-decoration-none text-dark" (click)="sortBy('totalAmount')">Total</a></th>
                </tr>
              </thead>
              <tbody>
                @for (o of pagedOrders; track o.id) {
                  <tr>
                    <td>{{ o.id }}</td>
                    <td>{{ o.userName }}</td>
                    <td>{{ o.orderDate | date:'short' }}</td>
                    <td>
                      @if (canEdit) {
                        <select class="form-select form-select-sm d-inline-block w-auto" [ngModel]="o.status" (ngModelChange)="updateStatus(o, $event)">
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      } @else {
                        {{ o.status }}
                      }
                    </td>
                    <td>₹{{ o.totalAmount | number:'1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <nav class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 pt-2 border-top">
              <div class="text-muted small">Showing {{ sortedOrders.length === 0 ? 0 : (orderPage - 1) * pageSize + 1 }} to {{ Math.min(orderPage * pageSize, sortedOrders.length) }} of {{ sortedOrders.length }} entries</div>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" [class.disabled]="orderPage === 1"><a class="page-link" href="javascript:void(0)" (click)="goToPage(1)"><i class="bi bi-chevron-double-left"></i></a></li>
                <li class="page-item" [class.disabled]="orderPage === 1"><a class="page-link" href="javascript:void(0)" (click)="goToPage(orderPage - 1)"><i class="bi bi-chevron-left"></i></a></li>
                @for (p of orderPageNumbers; track p) {
                  <li class="page-item" [class.active]="p === orderPage"><a class="page-link" href="javascript:void(0)" (click)="goToPage(p)">{{ p }}</a></li>
                }
                <li class="page-item" [class.disabled]="orderPage === totalPages"><a class="page-link" href="javascript:void(0)" (click)="goToPage(orderPage + 1)"><i class="bi bi-chevron-right"></i></a></li>
                <li class="page-item" [class.disabled]="orderPage === totalPages"><a class="page-link" href="javascript:void(0)" (click)="goToPage(totalPages)"><i class="bi bi-chevron-double-right"></i></a></li>
              </ul>
            </nav>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  statusFilter = '';
  canEdit = false;
  orderPage = 1;
  pageSize = 10;
  orderSortKey = '';
  orderSortAsc = true;
  Math = Math;

  get sortedOrders(): Order[] {
    if (!this.orderSortKey) return [...this.orders];
    return [...this.orders].sort((a: any, b: any) => {
      const va = a[this.orderSortKey], vb = b[this.orderSortKey];
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va ?? '').localeCompare(String(vb ?? ''));
      return this.orderSortAsc ? cmp : -cmp;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedOrders.length / this.pageSize));
  }

  get pagedOrders(): Order[] {
    const start = (this.orderPage - 1) * this.pageSize;
    return this.sortedOrders.slice(start, start + this.pageSize);
  }

  get orderPageNumbers(): number[] {
    const max = 5;
    let start = Math.max(1, this.orderPage - 2), end = Math.min(this.totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  sortBy(key: string) {
    if (this.orderSortKey === key) this.orderSortAsc = !this.orderSortAsc;
    else { this.orderSortKey = key; this.orderSortAsc = true; }
    this.orderPage = 1;
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) this.orderPage = p;
  }

  constructor(private api: ApiService, private auth: AuthService) {
    this.canEdit = auth.isAdmin() || auth.isVendor();
  }

  ngOnInit() {
    this.load();
  }

  load() {
    const params = this.statusFilter ? { status: this.statusFilter } : undefined;
    this.api.get<Order[]>('orders', params).subscribe((o) => (this.orders = o));
  }

  updateStatus(order: Order, status: string) {
    this.api.put(`orders/${order.id}/status`, { status }).subscribe({
      next: () => { order.status = status; this.load(); }
    });
  }
}
