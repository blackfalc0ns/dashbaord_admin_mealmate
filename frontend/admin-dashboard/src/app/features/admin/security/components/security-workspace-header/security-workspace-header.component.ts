import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideSearch, lucideShieldCheck } from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  MmBreadcrumbComponent,
  MmPageHeadingComponent,
  MmShellCardComponent,
} from '../../../../../shared/components/layout';
import { BreadcrumbItem } from '../../../../../shared/models/breadcrumb-item.model';
import { SecurityAdminPage, SecurityTone } from '../../data/security-admin-pages.data';
import {
  resolveSecurityContext,
  SecurityAccessPanel,
  SecurityUsersPanel,
  SecurityWorkspaceTab,
} from '../../config/security-workspace.config';
import { SecuritySectionNavComponent } from '../security-section-nav/security-section-nav.component';
import {
  securityCommandBarAccentVariants,
  securityCommandBarActionIconVariants,
  securityCommandBarActionVariants,
  securityCommandBarChipMarkVariants,
  securityCommandBarChipVariants,
  securityCommandBarFilterPillVariants,
  securityCommandBarFilterRowVariants,
  securityCommandBarHeroVariants,
  securityCommandBarLeadPillVariants,
  securityCommandBarLeadRowVariants,
  securityCommandBarMetaRowVariants,
  securityCommandBarNavSectionVariants,
  securityCommandBarRowLabelVariants,
  securityCommandBarSearchVariants,
  securityCommandBarSecondaryActionVariants,
  securityCommandBarSecondaryActionsVariants,
  securityCommandBarUtilityRowVariants,
  securityCommandBarVariants,
} from './security-workspace-header.variants';

const HEADER_ICONS = {
  lucidePlus,
  lucideSearch,
  lucideShieldCheck,
};

@Component({
  selector: 'mm-security-workspace-header',
  standalone: true,
  imports: [
    NgIcon,
    MmShellCardComponent,
    MmBreadcrumbComponent,
    SecuritySectionNavComponent,
  ],
  providers: [provideIcons(HEADER_ICONS)],
  templateUrl: './security-workspace-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block shrink-0',
  },
})
export class SecurityWorkspaceHeaderComponent {
  private readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);

  readonly activeTab = input.required<SecurityWorkspaceTab>();
  readonly accessPanel = input<SecurityAccessPanel>('roles');
  readonly usersPanel = input<SecurityUsersPanel>('directory');
  readonly page = input<SecurityAdminPage | null>(null);

  readonly tabChange = output<SecurityWorkspaceTab>();
  readonly accessPanelChange = output<SecurityAccessPanel>();
  readonly usersPanelChange = output<SecurityUsersPanel>();

  readonly context = computed(() =>
    resolveSecurityContext(this.activeTab(), this.accessPanel(), this.usersPanel()),
  );

  readonly panelLabel = computed(() =>
    this.locale.isRtl() ? 'لوحة المسؤول' : 'Admin Panel',
  );

  readonly sectionLabel = computed(() =>
    this.locale.isRtl() ? this.context().titleAr : this.context().titleEn,
  );

  readonly pageTitle = computed(() => {
    const workspacePage = this.page();
    if (workspacePage) {
      return this.t(workspacePage.titleAr, workspacePage.titleEn);
    }

    return this.t('الأمان والصلاحيات', 'Security & access');
  });

  readonly pageDescription = computed(() => {
    const workspacePage = this.page();
    if (workspacePage) {
      return this.t(workspacePage.goalAr, workspacePage.goalEn);
    }

    return this.locale.isRtl() ? this.context().descriptionAr : this.context().descriptionEn;
  });

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const securityLabel = this.locale.isRtl() ? 'الأمان والصلاحيات' : 'Security';

    if (this.activeTab() === 'overview') {
      return [{ label: securityLabel, active: true }];
    }

    return [
      { label: securityLabel, active: false },
      { label: this.sectionLabel(), active: true },
    ];
  });

  readonly quickActionLabel = computed(() => {
    const workspacePage = this.page();
    if (workspacePage) {
      return this.t(workspacePage.primaryActionAr, workspacePage.primaryActionEn);
    }

    return this.locale.isRtl() ? this.context().actionAr : this.context().actionEn;
  });

  readonly secondaryActions = computed(() => this.page()?.actions ?? []);

  readonly leadItems = computed(() => this.page()?.leadItems ?? []);

  readonly filterItems = computed(() => this.page()?.sideItems ?? []);

  shellClass(): string {
    return securityCommandBarVariants();
  }

  accentClass(): string {
    return securityCommandBarAccentVariants();
  }

  heroClass(): string {
    return securityCommandBarHeroVariants();
  }

  metaRowClass(): string {
    return securityCommandBarMetaRowVariants();
  }

  utilityRowClass(): string {
    return securityCommandBarUtilityRowVariants();
  }

  searchClass(): string {
    return securityCommandBarSearchVariants();
  }

  secondaryActionsClass(): string {
    return securityCommandBarSecondaryActionsVariants();
  }

  secondaryActionClass(): string {
    return securityCommandBarSecondaryActionVariants();
  }

  leadRowClass(): string {
    return securityCommandBarLeadRowVariants();
  }

  filterRowClass(): string {
    return securityCommandBarFilterRowVariants();
  }

  rowLabelClass(): string {
    return securityCommandBarRowLabelVariants();
  }

  chipClass(tone: 'live' | 'muted' | 'warn' | 'role' | 'scope' | 'eyebrow'): string {
    return securityCommandBarChipVariants({ tone });
  }

  chipMarkClass(): string {
    return securityCommandBarChipMarkVariants();
  }

  leadPillClass(tone: SecurityTone): string {
    return `${securityCommandBarLeadPillVariants()} ${this.toneSurfaceClass(tone)} ${this.toneBorderClass(tone)}`;
  }

  filterPillClass(tone: SecurityTone): string {
    return `${securityCommandBarFilterPillVariants()} ${this.toneBadgeClass(tone)}`;
  }

  dotClass(tone: SecurityTone): string {
    return `size-2 shrink-0 rounded-full ${this.toneDotClass(tone)}`;
  }

  textClass(tone: SecurityTone): string {
    return this.toneTextClass(tone);
  }

  actionClass(): string {
    return securityCommandBarActionVariants();
  }

  actionIconClass(): string {
    return securityCommandBarActionIconVariants();
  }

  navSectionClass(): string {
    return securityCommandBarNavSectionVariants();
  }

  goHome(): void {
    void this.router.navigate(['/admin/overview']);
  }

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  private toneBorderClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'border-emerald-200',
      green: 'border-emerald-200',
      warm: 'border-amber-200',
      red: 'border-rose-200',
      blue: 'border-sky-200',
      slate: 'border-slate-200',
    };

    return classes[tone];
  }

  private toneSurfaceClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'bg-emerald-50/80',
      green: 'bg-emerald-50/80',
      warm: 'bg-amber-50/80',
      red: 'bg-rose-50/80',
      blue: 'bg-sky-50/80',
      slate: 'bg-slate-50/80',
    };

    return classes[tone];
  }

  private toneBadgeClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      warm: 'border-amber-200 bg-amber-50 text-amber-700',
      red: 'border-rose-200 bg-rose-50 text-rose-700',
      blue: 'border-sky-200 bg-sky-50 text-sky-700',
      slate: 'border-slate-200 bg-slate-50 text-slate-600',
    };

    return classes[tone];
  }

  private toneDotClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'bg-emerald-600',
      green: 'bg-emerald-500',
      warm: 'bg-amber-400',
      red: 'bg-rose-500',
      blue: 'bg-sky-500',
      slate: 'bg-slate-400',
    };

    return classes[tone];
  }

  private toneTextClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'text-emerald-700',
      green: 'text-emerald-700',
      warm: 'text-amber-700',
      red: 'text-rose-600',
      blue: 'text-sky-600',
      slate: 'text-slate-500',
    };

    return classes[tone];
  }
}
