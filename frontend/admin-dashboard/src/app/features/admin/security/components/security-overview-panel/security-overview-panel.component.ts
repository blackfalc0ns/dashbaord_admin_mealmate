import { Component, inject, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideFileText,
  lucideFingerprint,
  lucideGlobe,
  lucideHistory,
  lucideLock,
  lucideShield,
  lucideShieldCheck,
  lucideUserPlus,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  SecurityAccessPanel,
  SecurityUsersPanel,
  SecurityWorkspaceTab,
} from '../../config/security-workspace.config';
import {
  SECURITY_ADMIN_PAGES,
  SecurityTableRow,
  SecurityTone,
  securityRowCells,
} from '../../data/security-admin-pages.data';
import {
  securityOverviewActivityCardVariants,
  securityOverviewActivityHeadVariants,
  securityOverviewActivityHeaderVariants,
  securityOverviewActivityRowVariants,
  securityOverviewActivityStatusVariants,
  securityOverviewActivityTableVariants,
  securityOverviewActivityTimeVariants,
  securityOverviewActivityTypeBadgeVariants,
  securityOverviewBottomGridVariants,
  securityOverviewHeroActionPrimaryVariants,
  securityOverviewHeroActionSecondaryVariants,
  securityOverviewHeroActionsVariants,
  securityOverviewHeroBadgeVariants,
  securityOverviewHeroGlowSecondaryVariants,
  securityOverviewHeroGlowVariants,
  securityOverviewHeroGridVariants,
  securityOverviewHeroTextVariants,
  securityOverviewHeroTitleVariants,
  securityOverviewHeroVariants,
  securityOverviewJumpCardGlowVariants,
  securityOverviewJumpCardVariants,
  securityOverviewJumpGridVariants,
  securityOverviewJumpIconVariants,
  securityOverviewJumpStatVariants,
  securityOverviewKpiCardVariants,
  securityOverviewKpiGridVariants,
  securityOverviewKpiIconVariants,
  securityOverviewKpiLiveVariants,
  securityOverviewPrincipleCardVariants,
  securityOverviewPrincipleGridVariants,
  securityOverviewPrincipleIconVariants,
  securityOverviewPrincipleBodyVariants,
  securityOverviewPrinciplesShellVariants,
  securityOverviewScoreCardVariants,
  securityOverviewScoreInnerVariants,
  securityOverviewScoreRingVariants,
  securityOverviewShellVariants,
  securityOverviewViewAllVariants,
  SecurityOverviewJumpTone,
  SecurityOverviewKpiTone,
} from './security-overview-panel.variants';

const OVERVIEW_ICONS = {
  lucideArrowLeft,
  lucideFileText,
  lucideFingerprint,
  lucideGlobe,
  lucideHistory,
  lucideLock,
  lucideShield,
  lucideShieldCheck,
  lucideUserPlus,
  lucideUsers,
};

interface SecurityJumpCard {
  tab: SecurityWorkspaceTab;
  panel: SecurityAccessPanel | SecurityUsersPanel;
  tone: SecurityOverviewJumpTone;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  statAr: string;
  statEn: string;
  icon: string;
}

interface SecurityPostureItem {
  labelAr: string;
  labelEn: string;
  value: string;
  helperAr: string;
  helperEn: string;
  icon: string;
  tone: SecurityOverviewKpiTone;
}

interface SecurityPrincipleItem {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  icon: string;
}

@Component({
  selector: 'mm-security-overview-panel',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons(OVERVIEW_ICONS)],
  templateUrl: './security-overview-panel.component.html',
  host: {
    class: 'block',
  },
})
export class SecurityOverviewPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly securityRowCells = securityRowCells;
  readonly tabChange = output<{ tab: SecurityWorkspaceTab; panel?: string }>();

  readonly posture: SecurityPostureItem[] = [
    {
      labelAr: 'أدوار نشطة',
      labelEn: 'Active roles',
      value: '14',
      helperAr: '3 محمية',
      helperEn: '3 protected',
      icon: 'lucideShield',
      tone: 'green',
    },
    {
      labelAr: '2FA مفعّل',
      labelEn: '2FA enabled',
      value: '91%',
      helperAr: 'للأدوار الحساسة',
      helperEn: 'Sensitive roles',
      icon: 'lucideFingerprint',
      tone: 'blue',
    },
    {
      labelAr: 'مراجعة مطلوبة',
      labelEn: 'Needs review',
      value: '48',
      helperAr: '41 مستخدم + 7 دعوات',
      helperEn: '41 users + 7 invites',
      icon: 'lucideUserPlus',
      tone: 'warm',
    },
  ];

  readonly principles: SecurityPrincipleItem[] = [
    {
      titleAr: 'Backend enforced',
      titleEn: 'Backend enforced',
      bodyAr: 'الصلاحيات تُفرض من API؛ الواجهة للعرض والتشغيل فقط.',
      bodyEn: 'Permissions are enforced by the API; UI is for display and workflow only.',
      icon: 'lucideLock',
    },
    {
      titleAr: 'Audit إلزامي',
      titleEn: 'Mandatory audit',
      bodyAr: 'أي تغيير في الأدوار أو المستخدمين أو الاستردادات يُسجَّل.',
      bodyEn: 'Any role, user, or refund change is audit-logged.',
      icon: 'lucideHistory',
    },
    {
      titleAr: 'Country scope',
      titleEn: 'Country scope',
      bodyAr: 'Country Admin يرى ويدير فقط نطاقه؛ Super Admin يرى الكل.',
      bodyEn: 'Country Admin is scoped; Super Admin sees all countries.',
      icon: 'lucideGlobe',
    },
  ];

  readonly jumpCards: SecurityJumpCard[] = [
    {
      tab: 'access',
      panel: 'roles',
      tone: 'access',
      titleAr: 'الأدوار والصلاحيات',
      titleEn: 'Roles & access',
      descriptionAr: 'الأدوار، المصفوفة، والنطاقات في مساحة واحدة.',
      descriptionEn: 'Roles, matrix, and scopes in one workspace.',
      statAr: '4 تغييرات معلقة',
      statEn: '4 pending changes',
      icon: 'lucideShield',
    },
    {
      tab: 'users',
      panel: 'directory',
      tone: 'users',
      titleAr: 'المستخدمون والدعوات',
      titleEn: 'Users & invites',
      descriptionAr: 'دليل موحد + الدعوات وسجل النشاط.',
      descriptionEn: 'Unified directory plus invites and activity.',
      statAr: '2,840 حساب',
      statEn: '2,840 accounts',
      icon: 'lucideUsers',
    },
  ];

  readonly recentRows = SECURITY_ADMIN_PAGES.userInvites.rows.slice(0, 5);

  shellClass(): string {
    return securityOverviewShellVariants();
  }

  heroClass(): string {
    return securityOverviewHeroVariants();
  }

  heroGlowClass(): string {
    return securityOverviewHeroGlowVariants();
  }

  heroGlowSecondaryClass(): string {
    return securityOverviewHeroGlowSecondaryVariants();
  }

  heroGridClass(): string {
    return securityOverviewHeroGridVariants();
  }

  heroBadgeClass(): string {
    return securityOverviewHeroBadgeVariants();
  }

  heroTitleClass(): string {
    return securityOverviewHeroTitleVariants();
  }

  heroTextClass(): string {
    return securityOverviewHeroTextVariants();
  }

  heroActionsClass(): string {
    return securityOverviewHeroActionsVariants();
  }

  heroActionPrimaryClass(): string {
    return securityOverviewHeroActionPrimaryVariants();
  }

  heroActionSecondaryClass(): string {
    return securityOverviewHeroActionSecondaryVariants();
  }

  scoreCardClass(): string {
    return securityOverviewScoreCardVariants();
  }

  scoreRingClass(): string {
    return securityOverviewScoreRingVariants();
  }

  scoreInnerClass(): string {
    return securityOverviewScoreInnerVariants();
  }

  kpiGridClass(): string {
    return securityOverviewKpiGridVariants();
  }

  kpiCardClass(tone: SecurityOverviewKpiTone): string {
    return securityOverviewKpiCardVariants({ tone });
  }

  kpiIconClass(tone: SecurityOverviewKpiTone): string {
    return securityOverviewKpiIconVariants({ tone });
  }

  kpiLiveClass(tone: SecurityOverviewKpiTone): string {
    return securityOverviewKpiLiveVariants({ tone });
  }

  jumpGridClass(): string {
    return securityOverviewJumpGridVariants();
  }

  jumpCardClass(tone: SecurityOverviewJumpTone): string {
    return securityOverviewJumpCardVariants({ tone });
  }

  jumpGlowClass(tone: SecurityOverviewJumpTone): string {
    return securityOverviewJumpCardGlowVariants({ tone });
  }

  jumpIconClass(tone: SecurityOverviewJumpTone): string {
    return securityOverviewJumpIconVariants({ tone });
  }

  jumpStatClass(tone: SecurityOverviewJumpTone): string {
    return securityOverviewJumpStatVariants({ tone });
  }

  bottomGridClass(): string {
    return securityOverviewBottomGridVariants();
  }

  principlesShellClass(): string {
    return securityOverviewPrinciplesShellVariants();
  }

  principleGridClass(): string {
    return securityOverviewPrincipleGridVariants();
  }

  principleCardClass(): string {
    return securityOverviewPrincipleCardVariants();
  }

  principleIconClass(): string {
    return securityOverviewPrincipleIconVariants();
  }

  principleBodyClass(): string {
    return securityOverviewPrincipleBodyVariants();
  }

  activityCardClass(): string {
    return securityOverviewActivityCardVariants();
  }

  activityHeaderClass(): string {
    return securityOverviewActivityHeaderVariants();
  }

  activityTableClass(): string {
    return securityOverviewActivityTableVariants();
  }

  activityHeadClass(): string {
    return securityOverviewActivityHeadVariants();
  }

  activityRowClass(): string {
    return securityOverviewActivityRowVariants();
  }

  activityTypeBadgeClass(tone: SecurityTone): string {
    return securityOverviewActivityTypeBadgeVariants({ tone });
  }

  activityStatusClass(): string {
    return securityOverviewActivityStatusVariants();
  }

  activityTimeClass(): string {
    return securityOverviewActivityTimeVariants();
  }

  viewAllClass(): string {
    return securityOverviewViewAllVariants();
  }

  openWorkspace(tab: SecurityWorkspaceTab, panel?: string): void {
    this.tabChange.emit({ tab, panel });
  }

  t(en: string, ar: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  activityEntity(row: SecurityTableRow): string {
    const cells = securityRowCells(row, this.locale.isRtl());
    return cells['entity'] ?? '';
  }

  activityType(row: SecurityTableRow): string {
    const cells = securityRowCells(row, this.locale.isRtl());
    return cells['type'] ?? '';
  }

  activityStatus(row: SecurityTableRow): string {
    const cells = securityRowCells(row, this.locale.isRtl());
    return cells['status'] ?? '';
  }

  activityTime(row: SecurityTableRow): string {
    const cells = securityRowCells(row, this.locale.isRtl());
    return cells['time'] ?? '';
  }
}
