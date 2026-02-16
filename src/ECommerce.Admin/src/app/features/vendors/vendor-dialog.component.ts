import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-vendor-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ vendor ? 'Edit' : 'Add' }} Vendor</h5>
      <button type="button" class="btn-close" (click)="cancelled.emit()"></button>
    </div>
    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="modal-body">
        <div class="mb-3"><label class="form-label">Name</label><input type="text" class="form-control" formControlName="name"></div>
        <div class="mb-3"><label class="form-label">Contact Info</label><input type="text" class="form-control" formControlName="contactInfo"></div>
        <div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" formControlName="email"></div>
        <div class="mb-3"><label class="form-label">Phone</label><input type="text" class="form-control" formControlName="phone"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="cancelled.emit()">Cancel</button>
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">@if (saving) { <span class="spinner-border spinner-border-sm me-1"></span> } Save</button>
      </div>
    </form>
  `,
  styles: []
})
export class VendorDialogComponent implements OnChanges {
  @Input() vendor?: { id: number; name: string; contactInfo: string; email?: string; phone?: string };
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      contactInfo: ['', Validators.required],
      email: [''],
      phone: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const v = this.vendor;
    this.form.patchValue({ name: v?.name ?? '', contactInfo: v?.contactInfo ?? '', email: v?.email ?? '', phone: v?.phone ?? '' });
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const body = this.form.value;
    const obs = this.vendor ? this.api.put('vendors/' + this.vendor.id, body) : this.api.post('vendors', body);
    obs.subscribe({ next: () => { this.saved.emit(); this.saving = false; }, error: () => { this.saving = false; }, complete: () => { this.saving = false; } });
  }
}
