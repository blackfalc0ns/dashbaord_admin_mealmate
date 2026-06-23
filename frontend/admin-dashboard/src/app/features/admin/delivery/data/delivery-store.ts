import { Injectable, inject } from '@angular/core';
import { OperationsStore } from '@/features/admin/operations/data/operations-store';

/**
 * Delivery workspace store — delegates to OperationsStore (single source of truth).
 * Legacy delivery/ folder pages use this facade until fully merged into operations routes.
 */
@Injectable({ providedIn: 'root' })
export class DeliveryStore {
  private readonly operations = inject(OperationsStore);

  readonly trackingRows = this.operations.trackingRows;
  readonly holdCases = this.operations.holdCases;

  resolveHoldCase(caseId: string): void {
    this.operations.resolveHoldCase(caseId);
  }

  recordContactAttempt(caseId: string): void {
    this.operations.recordContactAttempt(caseId);
  }
}

/** @deprecated Use DeliveryStore */
export { DeliveryStore as DeliveryStateService };
