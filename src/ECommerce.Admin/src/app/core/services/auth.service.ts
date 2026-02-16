import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private userSignal = signal<Partial<AuthResponse> | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null')
  );

  isLoggedIn = computed(() => !!this.tokenSignal());
  user = computed(() => this.userSignal());

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null {
    return this.tokenSignal();
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
        this.tokenSignal.set(res.token);
        this.userSignal.set(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.userSignal()?.role === 'Admin';
  }

  isVendor(): boolean {
    return this.userSignal()?.role === 'Vendor';
  }
}
