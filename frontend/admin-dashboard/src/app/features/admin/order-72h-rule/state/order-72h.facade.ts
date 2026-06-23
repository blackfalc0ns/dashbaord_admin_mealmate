import { Injectable, inject } from '@angular/core';
import { PageStateModel } from '../../../../shared/models/page-view-state.model';
import {
  AdminOrder72hRow,
  ConfirmationOverdueFilter,
  ReplacementWindowRow,
} from '../models';
import { Preparation24hRow } from '../models/preparation-24h.model';
import { Order72hStateService } from '../data/order-72h-state.service';

/** Facade state for admin F06 feature pages. */
export interface Order72hFacadeState {
  page: PageStateModel;
  monitorRows: AdminOrder72hRow[];
  overdueRows: AdminOrder72hRow[];
  replacementRows: ReplacementWindowRow[];
  preparationRows: Preparation24hRow[];
  filter: ConfirmationOverdueFilter;
}

const initialFilter: ConfirmationOverdueFilter = {
  page: 1,
  pageSize: 20,
};

/**
 * Orchestrates F06 admin pages — delegates to Order72hStateService.
 */
@Injectable({ providedIn: 'root' })
export class Order72hFacade {
  private readonly stateService = inject(Order72hStateService);
  private lastLoad: 'monitor' | 'overdue' | 'replacement' | 'preparation' | null = null;

  readonly state: Order72hFacadeState = {
    page: { viewState: 'idle' },
    monitorRows: [],
    overdueRows: [],
    replacementRows: [],
    preparationRows: [],
    filter: { ...initialFilter },
  };

  loadMonitor(): void {
    this.lastLoad = 'monitor';
    this.state.page.viewState = 'loading';
    this.state.monitorRows = this.stateService.monitorRows();
    this.state.page.viewState = this.state.monitorRows.length ? 'success' : 'empty';
  }

  loadOverdue(): void {
    this.lastLoad = 'overdue';
    this.state.page.viewState = 'loading';
    this.state.overdueRows = this.stateService.overdueRows();
    this.state.page.viewState = this.state.overdueRows.length ? 'success' : 'empty';
  }

  loadReplacementWindows(): void {
    this.lastLoad = 'replacement';
    this.state.page.viewState = 'loading';
    this.state.replacementRows = this.stateService.replacementWindows();
    this.state.page.viewState = this.state.replacementRows.length ? 'success' : 'empty';
  }

  loadPreparation24h(): void {
    this.lastLoad = 'preparation';
    this.state.page.viewState = 'loading';
    this.state.preparationRows = this.stateService.preparationRows();
    this.state.page.viewState = this.state.preparationRows.length ? 'success' : 'empty';
  }

  retry(): void {
    switch (this.lastLoad) {
      case 'monitor':
        this.loadMonitor();
        break;
      case 'overdue':
        this.loadOverdue();
        break;
      case 'replacement':
        this.loadReplacementWindows();
        break;
      case 'preparation':
        this.loadPreparation24h();
        break;
    }
  }

  reset(): void {
    this.state.page = { viewState: 'idle' };
    this.state.monitorRows = [];
    this.state.overdueRows = [];
    this.state.replacementRows = [];
    this.state.preparationRows = [];
    this.state.filter = { ...initialFilter };
    this.lastLoad = null;
  }
}
