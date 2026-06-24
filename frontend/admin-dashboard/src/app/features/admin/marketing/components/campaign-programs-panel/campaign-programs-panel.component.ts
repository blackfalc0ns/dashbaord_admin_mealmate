import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideLayers,
  lucideLink2,
  lucidePackage,
  lucideStore,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import {
  CampaignBundle,
  CampaignParticipant,
  CampaignProgram,
  CollaborativeCampaign,
} from '../../models';

@Component({
  selector: 'mm-campaign-programs-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideLayers, lucidePackage, lucideLink2, lucideArrowRight, lucideStore })],
  templateUrl: './campaign-programs-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignProgramsPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  readonly totalBundles = computed(() =>
    this.campaign().programs.reduce((sum, prog) => sum + prog.bundles.length, 0),
  );

  readonly linkedRestaurantCount = computed(() => {
    const ids = new Set(
      this.campaign().participants
        .filter((p) => p.enrollmentStatus === 'Agreed')
        .map((p) => p.restaurantId),
    );
    return ids.size;
  });

  programName(prog: CampaignProgram): string {
    return this.locale.isRtl() ? prog.nameAr : prog.nameEn;
  }

  bundleName(bun: CampaignBundle): string {
    return this.locale.isRtl() ? bun.nameAr : bun.nameEn;
  }

  systemBundleLabel(bun: CampaignBundle): string {
    return this.locale.isRtl() ? bun.linkedBundleLabelAr : bun.linkedBundleLabelEn;
  }

  participantsForBundle(bundleId: string): CampaignParticipant[] {
    return this.campaign().participants.filter((p) => p.campaignBundleId === bundleId);
  }

  agreedCountForBundle(bundleId: string): number {
    return this.participantsForBundle(bundleId).filter((p) => p.enrollmentStatus === 'Agreed').length;
  }

  enrollmentLabel(status: CampaignParticipant['enrollmentStatus']): string {
    const c = this.copy();
    if (status === 'Agreed') return c.enrollmentAgreed;
    if (status === 'Declined') return c.enrollmentDeclined;
    return c.enrollmentPending;
  }

  programAccent(index: number): { header: string; icon: string; badge: string; bundle: string } {
    const accents = [
      {
        header: 'from-violet-600 to-violet-500',
        icon: 'bg-white/20 text-white',
        badge: 'bg-white/15 text-white ring-white/25',
        bundle: 'border-violet-100 hover:border-violet-200 hover:shadow-violet-100/50',
      },
      {
        header: 'from-emerald-600 to-teal-500',
        icon: 'bg-white/20 text-white',
        badge: 'bg-white/15 text-white ring-white/25',
        bundle: 'border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-100/50',
      },
      {
        header: 'from-amber-500 to-orange-500',
        icon: 'bg-white/20 text-white',
        badge: 'bg-white/15 text-white ring-white/25',
        bundle: 'border-amber-100 hover:border-amber-200 hover:shadow-amber-100/50',
      },
    ];
    return accents[index % accents.length];
  }
}
