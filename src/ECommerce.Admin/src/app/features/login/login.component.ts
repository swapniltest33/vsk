import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-bg">
        <div class="login-bg-shape shape-1"></div>
        <div class="login-bg-shape shape-2"></div>
      </div>
      <div class="login-content">
        <div class="login-brand text-center mb-4">
          <div class="brand-icon mx-auto mb-3 d-flex align-items-center justify-content-center">
            <i class="bi bi-shop fs-1 text-white"></i>
          </div>
          <h1 class="fw-bold mb-1">E-Commerce Admin</h1>
          <p class="text-muted mb-0">Sign in to manage your store</p>
        </div>
        <div class="card shadow border-0">
          <div class="card-body p-4">
            <h5 class="card-title fw-semibold mb-1">Welcome back</h5>
            <p class="text-muted small mb-4">Enter your credentials to continue</p>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control" formControlName="email" placeholder="admin@ecommerce.com">
                </div>
                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                  <div class="text-danger small mt-1">
                    @if (form.get('email')?.hasError('required')) { Email is required }
                    @if (form.get('email')?.hasError('email')) { Invalid email }
                  </div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" class="form-control" formControlName="password">
                </div>
                @if (form.get('password')?.invalid && form.get('password')?.touched) {
                  <div class="text-danger small mt-1">Password is required</div>
                }
              </div>
              @if (error) {
                <div class="alert alert-danger d-flex align-items-center gap-2 py-2">
                  <i class="bi bi-exclamation-circle"></i>
                  <span>{{ error }}</span>
                </div>
              }
              <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" [disabled]="loading">
                @if (loading) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                }
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .login-bg { position: absolute; inset: 0; pointer-events: none; }
    .login-bg-shape { position: absolute; border-radius: 50%; opacity: 0.4; }
    .shape-1 { width: 400px; height: 400px; background: linear-gradient(135deg, #6366f1, #7c3aed); top: -150px; right: -80px; }
    .shape-2 { width: 250px; height: 250px; background: linear-gradient(135deg, #818cf8, #6366f1); bottom: -60px; left: -60px; }
    .login-content { position: relative; z-index: 1; width: 100%; max-width: 400px; }
    .brand-icon { width: 64px; height: 64px; border-radius: 12px; background: var(--admin-primary, #6366f1); }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value.email, this.form.value.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.error || 'Login failed';
      },
      complete: () => { this.loading = false; }
    });
  }
}
