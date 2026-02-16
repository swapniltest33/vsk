import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DataGridColumn {
  key: string;
  label: string;
  sortable?: boolean;
  format?: 'text' | 'number' | 'currency' | 'date';
  width?: string;
  class?: string;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-grid">
      <div class="table-responsive">
        <table class="table table-bordered table-hover table-striped align-middle mb-0">
          <thead class="table-light">
            <tr>
              @for (col of columns; track col.key) {
                <th [class.text-nowrap]="col.sortable" [style.width]="col.width">
                  @if (col.sortable) {
                    <a href="javascript:void(0)" class="text-decoration-none text-dark d-flex align-items-center gap-1" (click)="sort(col.key)">
                      {{ col.label }}
                      @if (sortColumn === col.key) {
                        <i class="bi" [class.bi-arrow-down]="sortAsc" [class.bi-arrow-up]="!sortAsc"></i>
                      } @else {
                        <i class="bi bi-arrow-down-up text-muted small"></i>
                      }
                    </a>
                  } @else {
                    {{ col.label }}
                  }
                </th>
              }
              @if (showActions) {
                <th class="text-center" style="width:100px">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of pagedData; track trackByFn($index, row)) {
              <tr>
                @for (col of columns; track col.key) {
                  <td [class]="col.class" [class.text-danger]="col.key === 'stock' && row[col.key] < 10" [class.fw-semibold]="col.key === 'stock' && row[col.key] < 10">
                    @switch (col.format) {
                      @case ('currency') {
                        ₹{{ row[col.key] | number:'1.2-2' }}
                      }
                      @case ('number') {
                        {{ row[col.key] | number }}
                      }
                      @case ('date') {
                        {{ row[col.key] | date:'short' }}
                      }
                      @default {
                        {{ row[col.key] }}
                      }
                    }
                  </td>
                }
                @if (showActions) {
                  <td class="text-center">
                    <button class="btn btn-sm btn-link text-primary p-0 me-2" (click)="onEdit.emit(row)" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-link text-danger p-0" (click)="onDelete.emit(row)" title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                }
              </tr>
            }
            @empty {
              <tr>
                <td [attr.colspan]="columns.length + (showActions ? 1 : 0)" class="text-center text-muted py-5">
                  <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                  No data to display
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <nav class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 pt-2 border-top">
          <div class="text-muted small">
            Showing {{ sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, sortedData.length) }} of {{ sortedData.length }} entries
          </div>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <a class="page-link" href="javascript:void(0)" (click)="goToPage(1)"><i class="bi bi-chevron-double-left"></i></a>
            </li>
            <li class="page-item" [class.disabled]="currentPage === 1">
              <a class="page-link" href="javascript:void(0)" (click)="goToPage(currentPage - 1)"><i class="bi bi-chevron-left"></i></a>
            </li>
            @for (p of pageNumbers; track p) {
              <li class="page-item" [class.active]="p === currentPage">
                <a class="page-link" href="javascript:void(0)" (click)="goToPage(p)">{{ p }}</a>
              </li>
            }
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <a class="page-link" href="javascript:void(0)" (click)="goToPage(currentPage + 1)"><i class="bi bi-chevron-right"></i></a>
            </li>
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <a class="page-link" href="javascript:void(0)" (click)="goToPage(totalPages)"><i class="bi bi-chevron-double-right"></i></a>
            </li>
          </ul>
        </nav>
    </div>
  `,
  styles: [`
    .data-grid .table th a { user-select: none; }
    .data-grid .table th { font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  `]
})
export class DataGridComponent {
  @Input() data: any[] = [];
  @Input() columns: DataGridColumn[] = [];
  @Input() pageSize = 10;
  @Input() showActions = false;
  @Input() trackByFn: (index: number, row: any) => any = (_, row) => row?.id ?? row;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  sortColumn = '';
  sortAsc = true;
  currentPage = 1;
  Math = Math;

  get sortedData(): any[] {
    if (!this.sortColumn) return [...this.data];
    return [...this.data].sort((a, b) => {
      const va = a[this.sortColumn];
      const vb = b[this.sortColumn];
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va ?? '').localeCompare(String(vb ?? ''));
      return this.sortAsc ? cmp : -cmp;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedData.length / this.pageSize));
  }

  get pagedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedData.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const max = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + max - 1);
    if (end - start < max - 1) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  sort(key: string) {
    if (this.sortColumn === key) this.sortAsc = !this.sortAsc;
    else { this.sortColumn = key; this.sortAsc = true; }
    this.currentPage = 1;
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) this.currentPage = p;
  }
}
