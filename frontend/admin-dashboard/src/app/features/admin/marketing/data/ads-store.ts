import { computed, Injectable, signal } from '@angular/core';

import { MOCK_AD_AREAS, MOCK_AD_AUDIT, MOCK_AD_BIDS, MOCK_AD_POLICY_RULES, MOCK_AD_SLOTS } from './ads.mock';
import {
  AdAreaOption,
  AdAuditEvent,
  AdBidStatus,
  AdBiddingKpis,
  AdSlot,
  CreateAdSlotPayload,
  RestaurantAdBid,
} from '../models/ad-bidding.model';

@Injectable({ providedIn: 'root' })
export class AdsStore {
  private readonly _slots = signal<AdSlot[]>([...MOCK_AD_SLOTS]);
  private readonly _bids = signal<RestaurantAdBid[]>([...MOCK_AD_BIDS]);
  private readonly _audit = signal<AdAuditEvent[]>([...MOCK_AD_AUDIT]);
  private readonly _selectedSlotId = signal(MOCK_AD_SLOTS[0]?.id ?? '');

  readonly slots = this._slots.asReadonly();
  readonly bids = this._bids.asReadonly();
  readonly audit = this._audit.asReadonly();
  readonly policyRules = MOCK_AD_POLICY_RULES;
  readonly areas = MOCK_AD_AREAS;
  readonly selectedSlotId = this._selectedSlotId.asReadonly();

  readonly selectedSlot = computed(() => {
    const id = this._selectedSlotId();
    return this._slots().find((slot) => slot.id === id) ?? this._slots()[0] ?? null;
  });

  readonly selectedBids = computed(() => {
    const slot = this.selectedSlot();
    return slot ? this._bids().filter((bid) => bid.slotId === slot.id) : [];
  });

  readonly kpis = computed<AdBiddingKpis>(() => {
    const slots = this._slots();
    const bids = this._bids();
    const impressions = slots.reduce((sum, slot) => sum + slot.impressions, 0);
    const clicks = slots.reduce((sum, slot) => sum + slot.clicks, 0);

    return {
      openAuctions: slots.filter((slot) => slot.status === 'Open' || slot.status === 'ClosingSoon').length,
      liveSlots: slots.filter((slot) => slot.status === 'Live').length,
      pendingReview: bids.filter((bid) => bid.status === 'Pending' || bid.status === 'Leading').length,
      totalRevenueKd: slots.reduce((sum, slot) => sum + slot.revenueKd, 0),
      averageCtr: impressions ? Math.round((clicks / impressions) * 1000) / 10 : 0,
      policyIssues: bids.filter((bid) => bid.status === 'Rejected').length,
    };
  });

  load(): void {
    this._slots.set([...MOCK_AD_SLOTS]);
    this._bids.set([...MOCK_AD_BIDS]);
    this._audit.set([...MOCK_AD_AUDIT]);
    this._selectedSlotId.set(MOCK_AD_SLOTS[0]?.id ?? '');
  }

  selectSlot(id: string): void {
    this._selectedSlotId.set(id);
  }

  isAuctionEnded(slot: AdSlot): boolean {
    return Date.now() >= new Date(slot.endAtUtc).getTime();
  }

  createSlot(payload: CreateAdSlotPayload): string {
    const id = `ad-slot-new-${Date.now()}`;
    const slot: AdSlot = {
      id,
      areaId: payload.areaId,
      areaNameAr: payload.areaNameAr,
      areaNameEn: payload.areaNameEn,
      placement: payload.placement,
      status: 'Open',
      maxWinners: payload.maxWinners,
      minBidKd: payload.minBidKd,
      startAtUtc: payload.startAtUtc,
      endAtUtc: payload.endAtUtc,
      impressions: 0,
      clicks: 0,
      revenueKd: 0,
      winnerBidIds: [],
    };

    this._slots.update((list) => [slot, ...list]);
    this._selectedSlotId.set(id);
    this.addAudit('SlotCreated', 'إنشاء مكان إعلاني', 'Created ad slot', slot.areaNameAr, slot.areaNameEn);
    return id;
  }

  approveBid(id: string): boolean {
    const bid = this._bids().find((item) => item.id === id);
    if (!bid || bid.status === 'Rejected' || bid.status === 'Approved') return false;

    const slot = this._slots().find((item) => item.id === bid.slotId);
    if (!slot || !this.isAuctionEnded(slot)) return false;

    this.updateBidStatus(id, 'Approved');
    this.addAudit('BidApproved', 'اعتماد عرض إعلاني', 'Approved ad bid', bid.restaurantNameAr, bid.restaurantNameEn);
    return true;
  }

  rejectBid(id: string): void {
    const bid = this._bids().find((item) => item.id === id);
    if (!bid) return;
    this._bids.update((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Rejected' as AdBidStatus,
              reviewedAtUtc: new Date().toISOString(),
              rejectionReasonAr: item.rejectionReasonAr ?? 'تم الرفض من مراجعة الأدمن.',
              rejectionReasonEn: item.rejectionReasonEn ?? 'Rejected by admin review.',
            }
          : item,
      ),
    );
    this.addAudit('BidRejected', 'رفض عرض إعلاني', 'Rejected ad bid', bid.restaurantNameAr, bid.restaurantNameEn);
  }

  awardTopThree(slotId: string): boolean {
    const slot = this._slots().find((item) => item.id === slotId);
    if (!slot || !this.isAuctionEnded(slot)) return false;

    const ranked = this._bids()
      .filter((bid) => bid.slotId === slotId && bid.status !== 'Rejected')
      .sort((a, b) => b.bidAmountKd - a.bidAmountKd || b.qualityScore - a.qualityScore);
    const winners = ranked.slice(0, slot.maxWinners).map((bid) => bid.id);

    this._bids.update((list) =>
      list.map((bid) => {
        if (bid.slotId !== slotId || bid.status === 'Rejected') return bid;
        return {
          ...bid,
          status: winners.includes(bid.id) ? ('Winning' as AdBidStatus) : ('Outbid' as AdBidStatus),
          reviewedAtUtc: new Date().toISOString(),
        };
      }),
    );

    this._slots.update((list) =>
      list.map((item) =>
        item.id === slotId
          ? {
              ...item,
              status: 'Awarded',
              winnerBidIds: winners,
              revenueKd: ranked
                .filter((bid) => winners.includes(bid.id))
                .reduce((sum, bid) => sum + bid.bidAmountKd, 0),
            }
          : item,
      ),
    );

    this.addAudit('WinnersAwarded', 'حسم أعلى 3 عروض', 'Awarded top 3 bids', slot.areaNameAr, slot.areaNameEn);
    return true;
  }

  pauseSlot(slotId: string): void {
    const slot = this._slots().find((item) => item.id === slotId);
    if (!slot) return;
    this._slots.update((list) => list.map((item) => (item.id === slotId ? { ...item, status: 'Paused' } : item)));
    this.addAudit('SlotPaused', 'إيقاف مكان إعلاني', 'Paused ad slot', slot.areaNameAr, slot.areaNameEn);
  }

  reopenSlot(slotId: string): void {
    const slot = this._slots().find((item) => item.id === slotId);
    if (!slot) return;
    this._slots.update((list) =>
      list.map((item) => (item.id === slotId ? { ...item, status: item.winnerBidIds.length ? 'Awarded' : 'Open' } : item)),
    );
    this.addAudit('SlotReopened', 'إعادة فتح مكان إعلاني', 'Reopened ad slot', slot.areaNameAr, slot.areaNameEn);
  }

  private updateBidStatus(id: string, status: AdBidStatus): void {
    this._bids.update((list) =>
      list.map((bid) => (bid.id === id ? { ...bid, status, reviewedAtUtc: new Date().toISOString() } : bid)),
    );
  }

  private addAudit(action: string, actionAr: string, actionEn: string, detailAr: string, detailEn: string): void {
    const event: AdAuditEvent = {
      id: `ad-aud-${Date.now()}`,
      action,
      actionAr,
      actionEn,
      actor: 'admin-current',
      atUtc: new Date().toISOString(),
      detailAr,
      detailEn,
    };
    this._audit.update((list) => [event, ...list]);
  }
}
