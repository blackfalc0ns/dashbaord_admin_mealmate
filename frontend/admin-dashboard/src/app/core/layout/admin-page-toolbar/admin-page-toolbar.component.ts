import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';
import { AdminNavItem } from '@/core/navigation/admin-nav.model';
import {
  MmBreadcrumbComponent,
  MmPageHeadingComponent,
  MmShellCardComponent,
} from '@/shared/components/layout';
import { BreadcrumbItem } from '@/shared/models/breadcrumb-item.model';

@Component({
  selector: 'mm-admin-page-toolbar',
  standalone: true,
  imports: [
    RouterLink,
    MmShellCardComponent,
    MmBreadcrumbComponent,
    MmPageHeadingComponent,
  ],
  templateUrl: './admin-page-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block shrink-0',
  },
})
export class AdminPageToolbarComponent {
  private readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly pageContext = inject(AdminPageContextService);

  readonly panelLabel = computed(() =>
    this.locale.isRtl() ? 'لوحة المسؤول' : 'Admin Panel',
  );

  readonly operationsLabel = computed(() =>
    this.locale.isRtl() ? 'العمليات' : 'Operations',
  );

  readonly quickActionLabel = computed(() =>
    this.locale.isRtl() ? 'استثناء طارئ' : 'Quick exception',
  );

  readonly pageTitle = computed(() => {
    const page = this.pageContext.context().page;
    return page ? this.label(page) : this.panelLabel();
  });

  readonly pageDescription = computed(() => {
    const page = this.pageContext.context().page;
    if (!page) {
      return this.locale.isRtl()
        ? 'إدارة عمليات MealMate اليومية'
        : 'Manage daily MealMate operations';
    }

    return this.locale.isRtl()
      ? (page.descriptionAr ?? '')
      : (page.descriptionEn ?? '');
  });

  readonly groupTitle = computed(() => {
    const group = this.pageContext.context().group;
    return group ? this.label(group) : null;
  });

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [];

    if (this.groupTitle()) {
      items.push({ label: this.operationsLabel() });
      items.push({ label: this.groupTitle()! });
    }

    if (this.pageContext.context().page) {
      items.push({ label: this.pageTitle(), active: true });
    }

    return items;
  });

  label(item: AdminNavItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  goHome(): void {
    void this.router.navigate(['/admin/overview']);
  }
}
