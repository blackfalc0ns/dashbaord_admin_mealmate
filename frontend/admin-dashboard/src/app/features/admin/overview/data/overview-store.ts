import { Injectable, inject, signal } from '@angular/core';
import { PageStateModel } from '@/shared/models/page-view-state.model';
import {
  OverviewDashboardResponse,
  OverviewFilter,
  OverviewPeriod,
} from '../models/overview.model';
import { OverviewApiService } from './overview-api.service';

const initialFilter: OverviewFilter = { period: 'today' };

/** Signal store for F118 Admin Dashboard Overview. */
@Injectable({ providedIn: 'root' })
export class OverviewStore {
  private readonly api = inject(OverviewApiService);

  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly filter = signal<OverviewFilter>({ ...initialFilter });
  readonly data = signal<OverviewDashboardResponse | null>(null);

  loadOverview(): void {
    this.page.set({ viewState: 'loading' });
    this.api.getOverview(this.filter()).subscribe({
      next: (response) => {
        this.data.set(response);
        this.page.set({ viewState: 'success' });
      },
      error: (err: Error) => {
        this.page.set({
          viewState: 'error',
          errorMessage: err.message || 'تعذّر تحميل لوحة النظرة العامة',
        });
      },
    });
  }

  setPeriod(period: OverviewPeriod): void {
    if (this.filter().period === period) {
      return;
    }
    this.filter.set({ period });
    this.loadOverview();
  }

  retry(): void {
    this.loadOverview();
  }

  reset(): void {
    this.filter.set({ ...initialFilter });
    this.data.set(null);
    this.page.set({ viewState: 'idle' });
  }
}

/** @deprecated Use OverviewStore */
export { OverviewStore as OverviewFacade };
