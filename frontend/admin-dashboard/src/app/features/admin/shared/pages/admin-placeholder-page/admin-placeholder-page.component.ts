import { Component, computed, inject } from '@angular/core';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';

@Component({
  selector: 'mm-admin-placeholder-page',
  standalone: true,
  templateUrl: './admin-placeholder-page.component.html',
  host: {
    class: 'block',
  },
})
export class AdminPlaceholderPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly pageContext = inject(AdminPageContextService);

  readonly pageTitle = computed(() => {
    const page = this.pageContext.context().page;
    if (!page) {
      return this.locale.isRtl() ? 'الصفحة' : 'Page';
    }

    return this.locale.isRtl() ? page.labelAr : page.labelEn;
  });

  readonly pageDescription = computed(() => {
    const page = this.pageContext.context().page;
    if (!page) {
      return '';
    }

    return this.locale.isRtl()
      ? (page.descriptionAr ?? '')
      : (page.descriptionEn ?? '');
  });

  readonly comingSoonLabel = computed(() =>
    this.locale.isRtl() ? 'قيد التطوير' : 'Coming soon',
  );

  readonly hintLabel = computed(() =>
    this.locale.isRtl()
      ? 'هيكل الصفحة جاهز — سيتم ربط البيانات والوظائف لاحقاً.'
      : 'Page structure is ready — data and actions will be wired next.',
  );
}
