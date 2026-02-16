import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-subtitle">Sign in to your account to continue</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label>Email</label>
            <input type="email" formControlName="email" class="input-field" placeholder="you@example.com">
            <span class="error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Enter a valid email address</span>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" formControlName="password" class="input-field" placeholder="••••••••">
            <span class="error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Password is required</span>
          </div>
          <div class="error message-error" *ngIf="error">{{ error }}</div>
          <button type="submit" class="btn-primary btn-submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <p class="auth-footer">Don't have an account? <a routerLink="/register">Create one</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
    }
    .auth-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0 0 8px;
    }
    .auth-subtitle {
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      margin: 0 0 32px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--color-text);
    }
    .message-error {
      margin-bottom: 16px;
      padding: 12px;
      background: #fef2f2;
      border-radius: var(--radius-md);
      color: var(--color-error);
    }
    .btn-submit {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      margin-top: 8px;
    }
    .auth-footer {
      margin: 24px 0 0;
      font-size: 0.9375rem;
      color: var(--color-text-muted);
      text-align: center;
    }
    .auth-footer a { font-weight: 500; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
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
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Sign in failed';
      }
    });
  }
}
