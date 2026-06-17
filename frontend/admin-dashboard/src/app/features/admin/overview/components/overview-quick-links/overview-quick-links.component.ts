import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideClock,
  lucideMessageSquare,
  lucideReceipt,
  lucideShieldAlert,
  lucideUserCheck,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import { OverviewQuickLink } from '../../models/overview.model';

const LINK_ICONS = {
  lucideUserCheck,
  lucideClock,
  lucideCircleAlert,
  lucideShieldAlert,
  lucideMessageSquare,
  lucideReceipt,
};

@Component({
  selector: 'mm-overview-quick-links',
  standalone: true,
  imports: [ZardCardComponent, RouterLink, NgIcon],
  providers: [provideIcons(LINK_ICONS)],
  templateUrl: './overview-quick-links.component.html',
  styleUrl: './overview-quick-links.component.scss',
})
export class OverviewQuickLinksComponent {
  readonly locale = inject(AppLocaleService);
  readonly links = input.required<OverviewQuickLink[]>();

  label(link: OverviewQuickLink): string {
    return this.locale.isRtl() ? link.labelAr : link.labelEn;
  }
}
