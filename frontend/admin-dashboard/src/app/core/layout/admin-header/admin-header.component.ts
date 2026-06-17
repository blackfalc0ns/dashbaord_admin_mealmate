import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideGlobe, lucideMenu } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import { AdminShellLayoutService } from '@/core/layout/admin-shell-layout.service';
import { MmShellCardComponent } from '@/shared/components/layout';

@Component({
  selector: 'mm-admin-header',
  standalone: true,
  imports: [NgIcon, MmShellCardComponent],
  templateUrl: './admin-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block shrink-0',
  },
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideGlobe,
      lucideMenu,
    }),
  ],
})
export class AdminHeaderComponent {
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(AdminShellLayoutService);

  readonly brandLogoSrc = BRAND_ASSETS.full;
  readonly mobileIconSrc = BRAND_ASSETS.icon;

  readonly panelLabel = computed(() =>
    this.locale.isRtl() ? 'لوحة المسؤول' : 'Admin Panel',
  );

  readonly langSwitchLabel = computed(() =>
    this.locale.locale() === 'ar' ? 'English' : 'العربية',
  );

  readonly menuLabel = computed(() =>
    this.locale.isRtl() ? 'فتح القائمة' : 'Open menu',
  );

  readonly adminName = computed(() =>
    this.locale.isRtl() ? 'مسؤول النظام' : 'System Admin',
  );

  readonly adminRole = computed(() =>
    this.locale.isRtl() ? 'صلاحيات كاملة' : 'Full access',
  );

  readonly todayLabel = computed(() => {
    const date = new Date();
    return new Intl.DateTimeFormat(this.locale.locale() === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  });

  openMobileNav(): void {
    this.layout.openMobileNav();
  }
}
