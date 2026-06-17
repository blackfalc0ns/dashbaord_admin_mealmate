import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OverviewApiService } from '../data/overview-api.service';
import { OverviewFacade } from './overview.facade';

describe('OverviewFacade', () => {
  let facade: OverviewFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverviewFacade, OverviewApiService],
    });
    facade = TestBed.inject(OverviewFacade);
  });

  it('loads overview into success state', fakeAsync(() => {
    facade.loadOverview();
    expect(facade.page().viewState).toBe('loading');
    tick(300);
    expect(facade.page().viewState).toBe('success');
    expect(facade.data()?.kpis.length).toBe(16);
    expect(facade.data()?.snapshotMetrics.length).toBe(8);
    expect(facade.data()?.analyticsHighlights.length).toBe(6);
    expect(facade.data()?.operationsHighlights.length).toBe(6);
    expect(facade.data()?.accountsHighlights.length).toBe(6);
    expect(facade.data()?.subscriptionsHighlights.length).toBe(6);
    expect(facade.data()?.financeHighlights.length).toBe(6);
    expect(facade.data()?.supportHighlights.length).toBe(6);
    expect(facade.data()?.alertsHighlights.length).toBe(6);
    expect(facade.data()?.operationsQueue.length).toBe(5);
    expect(facade.data()?.subscriptionsInsights.length).toBe(5);
    expect(facade.data()?.financeInsights.length).toBe(5);
    expect(facade.data()?.supportInsights.length).toBe(5);
  }));

  it('reloads data when period changes', fakeAsync(() => {
    facade.loadOverview();
    tick(300);
    facade.setPeriod('7d');
    expect(facade.filter().period).toBe('7d');
    tick(300);
    expect(facade.page().viewState).toBe('success');
    expect(facade.data()?.period).toBe('7d');
  }));

  it('retry reloads overview', fakeAsync(() => {
    facade.loadOverview();
    tick(300);
    facade.retry();
    expect(facade.page().viewState).toBe('loading');
    tick(300);
    expect(facade.page().viewState).toBe('success');
  }));
});
