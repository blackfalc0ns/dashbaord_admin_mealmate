import { Injectable } from '@angular/core';
import { PageStateModel } from '../../../../shared/models/page-view-state.model';
import {
  AdminOrder72hRow,
  ConfirmationOverdueFilter,
  ReplacementWindowRow,
} from '../models';

/** Facade state for admin F06 feature pages. */
export interface Order72hFacadeState {
  page: PageStateModel;
  monitorRows: AdminOrder72hRow[];
  overdueRows: AdminOrder72hRow[];
  replacementRows: ReplacementWindowRow[];
  filter: ConfirmationOverdueFilter;
}

const initialFilter: ConfirmationOverdueFilter = {
  page: 1,
  pageSize: 20,
};

const initialState: Order72hFacadeState = {
  page: { viewState: 'idle' },
  monitorRows: [],
  overdueRows: [],
  replacementRows: [],
  filter: initialFilter,
};

/**
 * Orchestrates F06 admin pages — components consume this, not API directly.
 */
@Injectable({ providedIn: 'root' })
export class Order72hFacade {
  readonly state: Order72hFacadeState = { ...initialState };

  loadMonitor(): void {
    // TODO: load −72h locked orders
  }

  loadOverdue(): void {
    // TODO: load confirmation-overdue list
  }

  loadReplacementWindows(): void {
    // TODO: load open/expired replacement windows
  }

  loadPreparation24h(): void {
    // TODO: load −24h preparation monitoring
  }

  retry(): void {
    // TODO: retry last failed action
  }

  reset(): void {
    Object.assign(this.state, initialState);
  }
}
