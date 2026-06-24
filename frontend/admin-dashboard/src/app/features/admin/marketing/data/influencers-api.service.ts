import { inject, Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { MarketingStore } from './marketing-store';
import {
  CreateInfluencerPayload,
  InfluencerProfile,
  InfluencerStatus,
  PromoCode,
} from '../models';

/** Stub API — delegates to MarketingStore until backend is ready. */
@Injectable({ providedIn: 'root' })
export class InfluencersApiService {
  private readonly store = inject(MarketingStore);

  listInfluencers(): Observable<InfluencerProfile[]> {
    return of(this.store.influencers()).pipe(delay(300));
  }

  getInfluencer(id: string): Observable<InfluencerProfile | undefined> {
    return of(this.store.getInfluencerById(id)).pipe(delay(200));
  }

  createInfluencer(payload: CreateInfluencerPayload): Observable<InfluencerProfile> {
    const created = this.store.createInfluencer(payload);
    return of(created).pipe(delay(500));
  }

  updateStatus(
    id: string,
    status: InfluencerStatus,
    reason?: string,
  ): Observable<void> {
    this.store.updateInfluencerStatus(id, status, reason);
    return of(void 0).pipe(delay(300));
  }

  updateCommissionRate(id: string, rate: number, reason?: string): Observable<void> {
    this.store.updateCommissionRate(id, rate, reason);
    return of(void 0).pipe(delay(300));
  }

  listPromoCodes(): Observable<PromoCode[]> {
    return of(this.store.promoCodes()).pipe(delay(200));
  }
}
