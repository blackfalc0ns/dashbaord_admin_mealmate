import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldAlert, lucideLayoutDashboard, lucideLogIn } from '@ng-icons/lucide';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { FORBIDDEN_I18N } from '@/core/i18n/translations/forbidden.i18n';

@Component({
  selector: 'mm-forbidden-page',
  standalone: true,
  imports: [RouterLink, NgIcon],
  providers: [provideIcons({ lucideShieldAlert, lucideLayoutDashboard, lucideLogIn })],
  templateUrl: './forbidden-page.component.html',
  host: { class: 'block min-h-[60vh]' },
})
export class ForbiddenPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => FORBIDDEN_I18N[this.locale.locale()]);
}
