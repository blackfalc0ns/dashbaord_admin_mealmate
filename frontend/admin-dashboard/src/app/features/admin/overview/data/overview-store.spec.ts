import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OverviewApiService } from '../data/overview-api.service';
import { OverviewStore } from '../data/overview-store';

describe('OverviewStore', () => {
  let store: OverviewStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverviewStore, OverviewApiService],
    });
    store = TestBed.inject(OverviewStore);
  });

  it('loads overview into success state', fakeAsync(() => {
    store.loadOverview();
    expect(store.page().viewState).toBe('loading');
    tick(300);
    expect(store.page().viewState).toBe('success');
    expect(store.data()?.kpis.length).toBe(16);
    expect(store.data()?.snapshotMetrics.length).toBe(8);
    expect(store.data()?.analyticsHighlights.length).toBe(6);
    expect(store.data()?.operationsHighlights.length).toBe(6);
    expect(store.data()?.accountsHighlights.length).toBe(6);
    expect(store.data()?.subscriptionsHighlights.length).toBe(6);
    expect(store.data()?.financeHighlights.length).toBe(6);
    expect(store.data()?.supportHighlights.length).toBe(6);
    expect(store.data()?.alertsHighlights.length).toBe(6);
    expect(store.data()?.operationsQueue.length).toBe(5);
    expect(store.data()?.subscriptionsInsights.length).toBe(5);
    expect(store.data()?.financeInsights.length).toBe(5);
    expect(store.data()?.supportInsights.length).toBe(5);
  }));

  it('reloads data when period changes', fakeAsync(() => {
    store.loadOverview();
    tick(300);
    store.setPeriod('7d');
    expect(store.filter().period).toBe('7d');
    tick(300);
    expect(store.page().viewState).toBe('success');
    expect(store.data()?.period).toBe('7d');
  }));

  it('retry reloads overview', fakeAsync(() => {
    store.loadOverview();
    tick(300);
    store.retry();
    expect(store.page().viewState).toBe('loading');
    tick(300);
    expect(store.page().viewState).toBe('success');
  }));
});
