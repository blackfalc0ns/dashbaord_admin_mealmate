import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { OverviewStatCardComponent } from './overview-stat-card.component';

describe('OverviewStatCardComponent', () => {
  let fixture: ComponentFixture<OverviewStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewStatCardComponent],
      providers: [provideRouter([]), AppLocaleService],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewStatCardComponent);
    fixture.componentRef.setInput('metric', {
      id: 'test',
      labelAr: 'اختبار',
      labelEn: 'Test',
      value: 10,
      displayValue: '10',
      deltaPercent: 5,
      route: '/admin/overview',
      icon: 'lucideClock',
      sparkline: [1, 2, 3, 4],
      format: 'number',
    });
    fixture.detectChanges();
  });

  it('renders metric label and value', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('اختبار');
    expect(el.textContent).toContain('10');
  });

  it('marks positive delta as up', () => {
    expect(fixture.componentInstance.deltaPositive()).toBe(true);
  });
});
