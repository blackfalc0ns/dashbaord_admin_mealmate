import { Injectable, signal } from '@angular/core';
import { DeliveryTrackingRow, HoldCaseRow } from '../models/delivery.model';
import { DELIVERY_TRACKING_MOCK, HOLD_CASES_MOCK } from '../data/delivery.mock';

@Injectable({ providedIn: 'root' })
export class DeliveryStateService {
  readonly trackingRows = signal<DeliveryTrackingRow[]>([...DELIVERY_TRACKING_MOCK]);
  readonly holdCases = signal<HoldCaseRow[]>([...HOLD_CASES_MOCK]);

  resolveHoldCase(caseId: string): void {
    this.holdCases.update((cases) =>
      cases.map((c) =>
        c.caseId === caseId ? { ...c, status: 'resolved' as const } : c,
      ),
    );
  }

  recordContactAttempt(caseId: string): void {
    this.holdCases.update((cases) =>
      cases.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              contactAttempts: c.contactAttempts + 1,
              lastContactAt: new Date().toISOString(),
              status: c.status === 'active' ? ('contact_pending' as const) : c.status,
            }
          : c,
      ),
    );
  }
}
