import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { SECURITY_NAV_LINKS, SecurityNavLink, SecurityTone } from '../../data/security-admin-pages.data';

@Component({
  selector: 'mm-security-hub-page',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './security-hub-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityHubPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly navLinks = SECURITY_NAV_LINKS;

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  linkLabel(link: SecurityNavLink): string {
    return this.t(link.labelAr, link.labelEn);
  }

  linkDescription(link: SecurityNavLink): string {
    return this.t(link.descriptionAr, link.descriptionEn);
  }

  toneClasses(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'border-emerald-600 bg-emerald-50 text-emerald-800',
      green: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      warm: 'border-amber-400 bg-amber-50 text-amber-700',
      red: 'border-rose-500 bg-rose-50 text-rose-700',
      blue: 'border-sky-500 bg-sky-50 text-sky-700',
      slate: 'border-slate-400 bg-slate-50 text-slate-600',
    };

    return classes[tone];
  }
}
