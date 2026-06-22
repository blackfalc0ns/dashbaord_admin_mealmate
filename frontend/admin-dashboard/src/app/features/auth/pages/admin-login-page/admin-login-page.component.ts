import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardInputDirective } from '@/shared/components/input';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { AuthFacade } from '../../state/auth.facade';
import { LOGIN_I18N } from '../../i18n/login.i18n';

@Component({
  selector: 'mm-admin-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
  ],
  templateUrl: './admin-login-page.component.html',
  host: {
    class: 'block min-h-dvh w-full overflow-x-hidden',
  },
})
export class AdminLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthFacade);
  readonly localeService = inject(AppLocaleService);

  readonly authHeroSrc = 'assets/images/auth/auth-hero.png';
  readonly brandLogoSrc = BRAND_ASSETS.full;
  readonly showPassword = signal(false);

  readonly locale = this.localeService.locale;
  readonly copy = computed(() => LOGIN_I18N[this.locale()]);
  readonly isSubmitting = computed(() => this.auth.viewState() === 'submitting');
  readonly canSubmit = computed(() => this.form.valid && !this.isSubmitting());
  readonly dir = this.localeService.dir;
  readonly isRtl = this.localeService.isRtl;

  readonly form = this.fb.nonNullable.group({
    identifier: ['admin@mealmate.com', [Validators.required]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    rememberSession: [false],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleLocale(): void {
    this.localeService.toggle();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.login(this.form.getRawValue());
  }
}
