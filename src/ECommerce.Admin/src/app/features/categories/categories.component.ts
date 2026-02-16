import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';

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
}

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-wrapper">
      <h1 class="page-title"><i class="bi bi-tags"></i> Categories & Subcategories</h1>
      
      <div class="row">
        <!-- Categories Section -->
        <div class="col-lg-6 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Categories</h5>
              <button class="btn btn-sm btn-primary" (click)="openCategoryModal()">
                <i class="bi bi-plus-lg"></i> Add
              </button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th class="ps-3">Name</th>
                      <th>Description</th>
                      <th class="text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (c of categories; track c.id) {
                      <tr (click)="selectCategory(c)" [class.table-primary]="selectedCategory?.id === c.id" style="cursor:pointer">
                        <td class="ps-3 fw-medium">{{ c.name }}</td>
                        <td class="text-muted small">{{ c.description | slice:0:50 }}{{ c.description.length > 50 ? '...' : '' }}</td>
                        <td class="text-end pe-3">
                          <button class="btn btn-link link-primary p-1" (click)="openCategoryModal(c); $event.stopPropagation()">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-link link-danger p-1" (click)="deleteCategory(c); $event.stopPropagation()">
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Subcategories Section -->
        <div class="col-lg-6 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                Subcategories 
                @if (selectedCategory) { <small class="text-muted">for {{ selectedCategory.name }}</small> }
              </h5>
              <button class="btn btn-sm btn-primary" (click)="openSubCategoryModal()" [disabled]="!selectedCategory">
                <i class="bi bi-plus-lg"></i> Add
              </button>
            </div>
            <div class="card-body p-0">
              @if (!selectedCategory) {
                <div class="text-center py-5 text-muted">
                  <i class="bi bi-arrow-left-circle display-6 d-block mb-3"></i>
                  <p>Select a category to view subcategories</p>
                </div>
              } @else {
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th class="ps-3">Name</th>
                        <th>Description</th>
                        <th class="text-end pe-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (sc of filteredSubCategories; track sc.id) {
                        <tr>
                          <td class="ps-3 fw-medium">{{ sc.name }}</td>
                          <td class="text-muted small">{{ sc.description | slice:0:50 }}{{ sc.description.length > 50 ? '...' : '' }}</td>
                          <td class="text-end pe-3">
                            <button class="btn btn-link link-primary p-1" (click)="openSubCategoryModal(sc)">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-link link-danger p-1" (click)="deleteSubCategory(sc)">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      } @empty {
                        <tr><td colspan="3" class="text-center py-4 text-muted">No subcategories found</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    @if (showCategoryModal) {
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header border-bottom py-3">
              <h5 class="modal-title font-monospace">{{ editingCategory ? 'Edit' : 'Add' }} Category</h5>
              <button type="button" class="btn-close" (click)="showCategoryModal=false"></button>
            </div>
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label fw-semibold small text-uppercase">Name</label>
                <input type="text" class="form-control" [(ngModel)]="categoryForm.name" placeholder="Category name">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small text-uppercase">Description</label>
                <textarea class="form-control" [(ngModel)]="categoryForm.description" rows="3" placeholder="Description"></textarea>
              </div>
            </div>
            <div class="modal-footer border-top p-3">
              <button type="button" class="btn btn-light px-4" (click)="showCategoryModal=false">Cancel</button>
              <button type="button" class="btn btn-primary px-4" (click)="saveCategory()" [disabled]="!categoryForm.name">Save</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Subcategory Modal -->
    @if (showSubCategoryModal) {
      <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header border-bottom py-3">
              <h5 class="modal-title font-monospace">{{ editingSubCategory ? 'Edit' : 'Add' }} Subcategory</h5>
              <button type="button" class="btn-close" (click)="showSubCategoryModal=false"></button>
            </div>
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label fw-semibold small text-uppercase">Category</label>
                <input type="text" class="form-control bg-light" [value]="selectedCategory?.name" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small text-uppercase">Name</label>
                <input type="text" class="form-control" [(ngModel)]="subCategoryForm.name" placeholder="Subcategory name">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small text-uppercase">Description</label>
                <textarea class="form-control" [(ngModel)]="subCategoryForm.description" rows="3" placeholder="Description"></textarea>
              </div>
            </div>
            <div class="modal-footer border-top p-3">
              <button type="button" class="btn btn-light px-4" (click)="showSubCategoryModal=false">Cancel</button>
              <button type="button" class="btn btn-primary px-4" (click)="saveSubCategory()" [disabled]="!subCategoryForm.name">Save</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    .table-primary { background-color: rgba(var(--bs-primary-rgb), 0.1) !important; }
  `]
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    subCategories: SubCategory[] = [];
    selectedCategory: Category | null = null;
    filteredSubCategories: SubCategory[] = [];

    showCategoryModal = false;
    showSubCategoryModal = false;
    editingCategory: Category | null = null;
    editingSubCategory: SubCategory | null = null;

    categoryForm = { name: '', description: '' };
    subCategoryForm = { name: '', description: '', categoryId: 0 };

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadCategories();
        this.loadSubCategories();
    }

    loadCategories() {
        this.api.get<Category[]>('categories').subscribe(res => {
            this.categories = res;
            if (this.selectedCategory) {
                const updated = res.find(c => c.id === this.selectedCategory?.id);
                this.selectedCategory = updated || null;
            }
        });
    }

    loadSubCategories() {
        this.api.get<SubCategory[]>('subcategories').subscribe(res => {
            this.subCategories = res;
            this.filterSubCategories();
        });
    }

    selectCategory(c: Category) {
        this.selectedCategory = c;
        this.filterSubCategories();
    }

    filterSubCategories() {
        if (!this.selectedCategory) {
            this.filteredSubCategories = [];
        } else {
            this.filteredSubCategories = this.subCategories.filter(sc => sc.categoryId === this.selectedCategory?.id);
        }
    }

    openCategoryModal(c?: Category) {
        this.editingCategory = c || null;
        this.categoryForm = {
            name: c?.name || '',
            description: c?.description || ''
        };
        this.showCategoryModal = true;
    }

    saveCategory() {
        const obs = this.editingCategory
            ? this.api.put(`categories/${this.editingCategory.id}`, this.categoryForm)
            : this.api.post('categories', this.categoryForm);

        obs.subscribe(() => {
            this.showCategoryModal = false;
            this.loadCategories();
        });
    }

    deleteCategory(c: Category) {
        if (confirm(`Delete category "${c.name}"? This will delete all its subcategories and may affect products.`)) {
            this.api.delete(`categories/${c.id}`).subscribe(() => {
                if (this.selectedCategory?.id === c.id) this.selectedCategory = null;
                this.loadCategories();
                this.loadSubCategories();
            });
        }
    }

    openSubCategoryModal(sc?: SubCategory) {
        if (!this.selectedCategory && !sc) return;
        this.editingSubCategory = sc || null;
        this.subCategoryForm = {
            name: sc?.name || '',
            description: sc?.description || '',
            categoryId: sc?.categoryId || (this.selectedCategory?.id || 0)
        };
        this.showSubCategoryModal = true;
    }

    saveSubCategory() {
        const obs = this.editingSubCategory
            ? this.api.put(`subcategories/${this.editingSubCategory.id}`, this.subCategoryForm)
            : this.api.post('subcategories', this.subCategoryForm);

        obs.subscribe(() => {
            this.showSubCategoryModal = false;
            this.loadSubCategories();
        });
    }

    deleteSubCategory(sc: SubCategory) {
        if (confirm(`Delete subcategory "${sc.name}"?`)) {
            this.api.delete(`subcategories/${sc.id}`).subscribe(() => {
                this.loadSubCategories();
            });
        }
    }
}
