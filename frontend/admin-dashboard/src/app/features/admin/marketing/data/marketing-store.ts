import { Injectable, signal, computed } from '@angular/core';
import {
  buildMarketingOverviewKpis,
  MOCK_CAMPAIGNS,
  MOCK_INFLUENCERS,
  MOCK_PROMO_CODES,
  MOCK_SYSTEM_BUNDLES,
} from './marketing-mock.data';
import {
  CreateCollaborativeCampaignPayload,
  CreateInfluencerPayload,
  InfluencerProfile,
  InfluencerStatus,
  CollaborativeCampaign,
  CollaborativeCampaignStatus,
  PromoCode,
} from '../models';
import {
  capacityMeetsTarget,
} from '../utils/collaborative-campaign.util';

@Injectable({ providedIn: 'root' })
export class MarketingStore {
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _influencers = signal<InfluencerProfile[]>([...MOCK_INFLUENCERS]);
  private readonly _campaigns = signal<CollaborativeCampaign[]>([...MOCK_CAMPAIGNS]);
  private readonly _promoCodes = signal<PromoCode[]>([...MOCK_PROMO_CODES]);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly influencers = this._influencers.asReadonly();
  readonly campaigns = this._campaigns.asReadonly();
  readonly promoCodes = this._promoCodes.asReadonly();

  readonly systemBundles = MOCK_SYSTEM_BUNDLES;

  readonly overviewKpis = computed(() =>
    buildMarketingOverviewKpis(this._influencers(), this._promoCodes()),
  );

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    setTimeout(() => {
      this._influencers.set([...MOCK_INFLUENCERS]);
      this._campaigns.set([...MOCK_CAMPAIGNS]);
      this._promoCodes.set([...MOCK_PROMO_CODES]);
      this._loading.set(false);
    }, 400);
  }

  getInfluencerById(id: string): InfluencerProfile | undefined {
    return this._influencers().find((i) => i.id === id);
  }

  getCampaignById(id: string): CollaborativeCampaign | undefined {
    return this._campaigns().find((c) => c.id === id);
  }

  createInfluencer(payload: CreateInfluencerPayload): InfluencerProfile {
    const id = `inf-${Date.now()}`;
    const now = new Date().toISOString();

    const profile: InfluencerProfile = {
      id,
      userId: payload.userId ?? null,
      displayNameAr: payload.displayNameAr,
      displayNameEn: payload.displayNameEn,
      contactPhone: payload.contactPhone,
      contactEmail: payload.contactEmail,
      socialChannels: payload.socialChannels,
      payoutInfoStatus: 'NotProvided',
      status: payload.activateNow ? 'Active' : 'Draft',
      defaultCommissionRate: payload.defaultCommissionRate,
      promotionLink: {
        id: `lnk-${Date.now()}`,
        slug: payload.slug,
        targetUrl: `https://mealmate.app/r/${payload.slug}`,
        status: 'Active',
        startAtUtc: now,
        endAtUtc: null,
      },
      promotionCode: {
        id: `code-${Date.now()}`,
        code: payload.code.toUpperCase(),
        status: 'Active',
        startAtUtc: now,
        endAtUtc: null,
        usageLimit: null,
        usageCount: 0,
      },
      stats: {
        referralsCount: 0,
        paidSubscriptionsCount: 0,
        pendingCommissionTotal: 0,
        paidCommissionTotal: 0,
        conversionRate: 0,
      },
      lastActivityAtUtc: now,
      createdAtUtc: now,
      createdByAdminId: 'admin-current',
      attributions: [],
      commissions: [],
      commissionRateHistory: [],
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          action: 'InfluencerCreated',
          actionAr: 'إنشاء ملف مؤثر',
          actionEn: 'Influencer profile created',
          actor: 'admin-current',
          atUtc: now,
        },
      ],
    };

    this._influencers.update((list) => [profile, ...list]);

    const promo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: payload.code.toUpperCase(),
      source: 'influencer',
      sourceId: id,
      sourceLabelAr: payload.displayNameAr,
      sourceLabelEn: payload.displayNameEn,
      discountType: 'percent',
      discountValue: 10,
      startAtUtc: now,
      endAtUtc: new Date(Date.now() + 90 * 86400000).toISOString(),
      usageLimit: null,
      usageCount: 0,
      status: 'Active',
    };
    this._promoCodes.update((list) => [promo, ...list]);

    return profile;
  }

  updateInfluencerStatus(id: string, status: InfluencerStatus, reason?: string): void {
    this._influencers.update((list) =>
      list.map((inf) => {
        if (inf.id !== id) return inf;
        const now = new Date().toISOString();
        return {
          ...inf,
          status,
          auditLog: [
            {
              id: `aud-${Date.now()}`,
              action: 'StatusChanged',
              actionAr: `تغيير الحالة إلى ${status}`,
              actionEn: `Status changed to ${status}`,
              actor: 'admin-current',
              atUtc: now,
              detailAr: reason,
              detailEn: reason,
            },
            ...inf.auditLog,
          ],
        };
      }),
    );
  }

  updateCommissionRate(id: string, newRate: number, reason?: string): void {
    this._influencers.update((list) =>
      list.map((inf) => {
        if (inf.id !== id) return inf;
        const now = new Date().toISOString();
        return {
          ...inf,
          defaultCommissionRate: newRate,
          commissionRateHistory: [
            {
              id: `cr-${Date.now()}`,
              previousRate: inf.defaultCommissionRate,
              newRate,
              changedAtUtc: now,
              changedBy: 'admin-current',
              reason,
            },
            ...inf.commissionRateHistory,
          ],
          auditLog: [
            {
              id: `aud-${Date.now()}`,
              action: 'CommissionRateChanged',
              actionAr: 'تغيير نسبة العمولة',
              actionEn: 'Commission rate changed',
              actor: 'admin-current',
              atUtc: now,
              detailAr: `من ${inf.defaultCommissionRate}% إلى ${newRate}%`,
              detailEn: `From ${inf.defaultCommissionRate}% to ${newRate}%`,
            },
            ...inf.auditLog,
          ],
        };
      }),
    );
  }

  createCampaign(payload: CreateCollaborativeCampaignPayload): CollaborativeCampaign {
    const id = `camp-${Date.now()}`;
    const now = new Date().toISOString();
    const programs = payload.programs.map((prog, pi) => ({
      id: `cprog-${Date.now()}-${pi}`,
      nameAr: prog.nameAr,
      nameEn: prog.nameEn,
      bundles: prog.bundles.map((bun, bi) => {
        const linked = MOCK_SYSTEM_BUNDLES.find((b) => b.id === bun.linkedBundleId);
        return {
          id: `cbun-${Date.now()}-${pi}-${bi}`,
          nameAr: bun.nameAr,
          nameEn: bun.nameEn,
          linkedBundleId: bun.linkedBundleId,
          linkedBundleLabelAr: linked ? `${linked.programAr} – ${linked.labelAr}` : bun.linkedBundleId,
          linkedBundleLabelEn: linked ? `${linked.programEn} – ${linked.labelEn}` : bun.linkedBundleId,
        };
      }),
    }));

    const campaign: CollaborativeCampaign = {
      id,
      nameAr: payload.nameAr,
      nameEn: payload.nameEn,
      descriptionAr: payload.descriptionAr,
      descriptionEn: payload.descriptionEn,
      status: payload.sendToRestaurants ? 'OpenForJoin' : 'Draft',
      totalDiscountPercent: payload.totalDiscountPercent,
      restaurantSharePercent: payload.restaurantSharePercent,
      platformSharePercent: payload.platformSharePercent,
      commissionOption: payload.commissionOption,
      startAtUtc: payload.startAtUtc,
      endAtUtc: payload.endAtUtc,
      maxSubscribers: payload.maxSubscribers,
      originalMaxSubscribers: payload.maxSubscribers,
      currentSubscribers: 0,
      programs,
      participants: [],
      auditLog: [
        {
          id: `caud-${Date.now()}`,
          action: 'Created',
          actionAr: 'إنشاء الحملة',
          actionEn: 'Campaign created',
          actor: 'admin-current',
          atUtc: now,
        },
        ...(payload.sendToRestaurants
          ? [{
              id: `caud-${Date.now() + 1}`,
              action: 'Sent',
              actionAr: 'إرسال للمطاعم',
              actionEn: 'Sent to restaurants',
              actor: 'admin-current',
              atUtc: now,
            }]
          : []),
      ],
      createdAtUtc: now,
      createdByAdminId: 'admin-current',
    };

    this._campaigns.update((list) => [campaign, ...list]);
    return campaign;
  }

  sendCampaignToRestaurants(id: string): void {
    this.updateCampaignStatus(id, 'OpenForJoin', 'إرسال للمطاعم');
  }

  markCampaignReviewed(id: string): void {
    this.updateCampaignStatus(id, 'Reviewed', 'اكتمال مراجعة الطاقة والأسعار');
  }

  launchCampaign(id: string): boolean {
    const camp = this.getCampaignById(id);
    if (!camp || camp.status !== 'Reviewed' || !capacityMeetsTarget(camp)) return false;
    this.updateCampaignStatus(id, 'Active', 'إطلاق الحملة للعملاء');
    return true;
  }

  stopCampaign(id: string): void {
    const now = new Date().toISOString();
    this._campaigns.update((list) =>
      list.map((camp) =>
        camp.id === id
          ? {
              ...camp,
              status: 'Stopped' as CollaborativeCampaignStatus,
              stoppedAtUtc: now,
              auditLog: [
                {
                  id: `caud-${Date.now()}`,
                  action: 'Stopped',
                  actionAr: 'إيقاف الحملة',
                  actionEn: 'Campaign stopped',
                  actor: 'admin-current',
                  atUtc: now,
                },
                ...camp.auditLog,
              ],
            }
          : camp,
      ),
    );
  }

  redistributeCampaignCapacity(id: string): void {
    const camp = this.getCampaignById(id);
    if (!camp) return;
    const target = camp.maxSubscribers;
    const agreed = camp.participants.filter((p) => p.enrollmentStatus === 'Agreed');
    if (!agreed.length) return;
    const perRestaurant = Math.ceil(target / agreed.length);
    this._campaigns.update((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const now = new Date().toISOString();
        return {
          ...c,
          participants: c.participants.map((p) =>
            p.enrollmentStatus === 'Agreed'
              ? { ...p, campaignDailyCapacity: perRestaurant, additionalCapacity: 0 }
              : p,
          ),
          auditLog: [
            {
              id: `caud-${Date.now()}`,
              action: 'CapacityRedistributed',
              actionAr: 'إعادة توزيع الطاقة الإجمالية',
              actionEn: 'Total capacity redistributed',
              actor: 'admin-current',
              atUtc: now,
              detailAr: `الهدف ${target} — ${perRestaurant} لكل مطعم`,
              detailEn: `Target ${target} — ${perRestaurant} per restaurant`,
            },
            ...c.auditLog,
          ],
        };
      }),
    );
  }

  increaseSubscriberCap(id: string, newCap: number, reason?: string): void {
    const camp = this.getCampaignById(id);
    if (!camp || newCap <= camp.maxSubscribers) return;
    this._campaigns.update((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const now = new Date().toISOString();
        return {
          ...c,
          maxSubscribers: newCap,
          auditLog: [
            {
              id: `caud-${Date.now()}`,
              action: 'SubscriberCapIncreased',
              actionAr: 'رفع سقف المشتركين',
              actionEn: 'Subscriber cap increased',
              actor: 'admin-current',
              atUtc: now,
              detailAr: reason ?? `من ${camp.maxSubscribers} إلى ${newCap}`,
              detailEn: reason ?? `From ${camp.maxSubscribers} to ${newCap}`,
            },
            ...c.auditLog,
          ],
        };
      }),
    );
  }

  updateCampaignStatus(id: string, status: CollaborativeCampaignStatus, reason?: string): void {
    this._campaigns.update((list) =>
      list.map((camp) => {
        if (camp.id !== id) return camp;
        const now = new Date().toISOString();
        const actionMap: Record<CollaborativeCampaignStatus, { ar: string; en: string }> = {
          Draft: { ar: 'مسودة', en: 'Draft' },
          OpenForJoin: { ar: 'مفتوحة للانضمام', en: 'Open for join' },
          Reviewed: { ar: 'تمت المراجعة', en: 'Reviewed' },
          Active: { ar: 'نشطة', en: 'Active' },
          Stopped: { ar: 'موقوفة', en: 'Stopped' },
        };
        const label = actionMap[status];
        return {
          ...camp,
          status,
          auditLog: [
            {
              id: `caud-${Date.now()}`,
              action: 'CampaignStatusChanged',
              actionAr: `تغيير حالة الحملة إلى ${label.ar}`,
              actionEn: `Campaign status changed to ${label.en}`,
              actor: 'admin-current',
              atUtc: now,
              detailAr: reason,
              detailEn: reason,
            },
            ...camp.auditLog,
          ],
        };
      }),
    );
  }
}
