import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthStore } from '@/core/auth/admin-auth.store';
import { AuthApiService } from '../data/auth-api.service';
import { AdminLoginRequest, LoginViewState } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly auth = inject(AdminAuthStore);

  readonly viewState = signal<LoginViewState>('idle');
  readonly errorMessage = signal<string | null>(null);

  login(request: AdminLoginRequest): void {
    this.viewState.set('submitting');
    this.errorMessage.set(null);

    this.api.login(request).subscribe({
      next: (response) => {
        this.auth.setSession({
          accessToken: response.accessToken,
          expiresAt: response.expiresAt,
          role: response.role,
        });
        this.viewState.set('idle');
        void this.router.navigateByUrl('/admin/overview', { replaceUrl: true });
      },
      error: (err: Error) => {
        this.viewState.set('error');
        this.errorMessage.set(err.message ?? 'فشل تسجيل الدخول');
      },
    });
  }

  logout(): void {
    this.auth.clearSession();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
