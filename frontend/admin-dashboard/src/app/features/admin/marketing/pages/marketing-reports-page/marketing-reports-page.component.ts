import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeDollarSign,
  lucideCalendarDays,
  lucideChartNoAxesCombined,
  lucideChevronDown,
  lucideCircleCheck,
  lucideClock3,
  lucideDownload,
  lucideLink2,
  lucideSearch,
  lucideTicketPercent,
  lucideTrendingUp,
  lucideUsers,
  lucideWalletCards,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { MarketingStore } from '../../data/marketing-store';

type CommissionStatusFilter = 'all' | 'Pending' | 'Paid' | 'Reversed';
type CommissionCategory = 'subscription' | 'restaurant' | 'delivery' | 'influencer' | 'campaign' | 'service';
type PlatformCommissionRow = {
  id: string; category: CommissionCategory; entityNameAr: string; entityNameEn: string;
  reference: string; baseAmount: number; appliedCommissionRate: number; commissionAmount: number;
  status: 'Pending' | 'Paid' | 'Reversed'; createdAtUtc: string;
};

const PLATFORM_COMMISSIONS: PlatformCommissionRow[] = [
  { id: 'pc-01', category: 'subscription', entityNameAr: 'اشتراك أحمد سالم', entityNameEn: 'Ahmed Salem subscription', reference: 'SUB-10582', baseAmount: 89, appliedCommissionRate: 22, commissionAmount: 19.58, status: 'Paid', createdAtUtc: '2026-06-30T09:15:00Z' },
  { id: 'pc-02', category: 'restaurant', entityNameAr: 'Green Kitchen', entityNameEn: 'Green Kitchen', reference: 'SET-8421', baseAmount: 460, appliedCommissionRate: 12, commissionAmount: 55.2, status: 'Pending', createdAtUtc: '2026-06-29T12:30:00Z' },
  { id: 'pc-03', category: 'delivery', entityNameAr: 'منطقة السالمية', entityNameEn: 'Salmiya zone', reference: 'DEL-7740', baseAmount: 128, appliedCommissionRate: 8, commissionAmount: 10.24, status: 'Paid', createdAtUtc: '2026-06-28T16:10:00Z' },
  { id: 'pc-04', category: 'subscription', entityNameAr: 'اشتراك نور محمد', entityNameEn: 'Nour Mohamed subscription', reference: 'SUB-10561', baseAmount: 120, appliedCommissionRate: 18, commissionAmount: 21.6, status: 'Paid', createdAtUtc: '2026-06-27T08:40:00Z' },
  { id: 'pc-05', category: 'restaurant', entityNameAr: 'Fit Bites', entityNameEn: 'Fit Bites', reference: 'SET-8398', baseAmount: 735, appliedCommissionRate: 10, commissionAmount: 73.5, status: 'Pending', createdAtUtc: '2026-06-26T11:20:00Z' },
  { id: 'pc-06', category: 'campaign', entityNameAr: 'حملة صيف صحي', entityNameEn: 'Healthy Summer campaign', reference: 'CAM-2031', baseAmount: 310, appliedCommissionRate: 5, commissionAmount: 15.5, status: 'Paid', createdAtUtc: '2026-06-25T14:05:00Z' },
  { id: 'pc-07', category: 'service', entityNameAr: 'رسوم تشغيل الطلبات', entityNameEn: 'Order processing fees', reference: 'SRV-6612', baseAmount: 540, appliedCommissionRate: 3, commissionAmount: 16.2, status: 'Paid', createdAtUtc: '2026-06-24T10:25:00Z' },
  { id: 'pc-08', category: 'delivery', entityNameAr: 'منطقة حولي', entityNameEn: 'Hawally zone', reference: 'DEL-7682', baseAmount: 96, appliedCommissionRate: 8, commissionAmount: 7.68, status: 'Pending', createdAtUtc: '2026-06-23T18:15:00Z' },
  { id: 'pc-09', category: 'restaurant', entityNameAr: 'Daily Balance', entityNameEn: 'Daily Balance', reference: 'SET-8337', baseAmount: 615, appliedCommissionRate: 11, commissionAmount: 67.65, status: 'Paid', createdAtUtc: '2026-06-22T09:00:00Z' },
  { id: 'pc-10', category: 'subscription', entityNameAr: 'اشتراك خالد علي', entityNameEn: 'Khaled Ali subscription', reference: 'SUB-10492', baseAmount: 67, appliedCommissionRate: 26, commissionAmount: 17.42, status: 'Reversed', createdAtUtc: '2026-06-20T13:45:00Z' },
  { id: 'pc-11', category: 'restaurant', entityNameAr: 'Lean Meals', entityNameEn: 'Lean Meals', reference: 'SET-8315', baseAmount: 890, appliedCommissionRate: 12, commissionAmount: 106.8, status: 'Paid', createdAtUtc: '2026-06-19T10:30:00Z' },
  { id: 'pc-12', category: 'subscription', entityNameAr: 'اشتراك سارة محمود', entityNameEn: 'Sara Mahmoud subscription', reference: 'SUB-10471', baseAmount: 150, appliedCommissionRate: 16, commissionAmount: 24, status: 'Paid', createdAtUtc: '2026-06-18T07:50:00Z' },
  { id: 'pc-13', category: 'campaign', entityNameAr: 'حملة العودة للنشاط', entityNameEn: 'Back to Fitness campaign', reference: 'CAM-2018', baseAmount: 475, appliedCommissionRate: 6, commissionAmount: 28.5, status: 'Pending', createdAtUtc: '2026-06-17T15:35:00Z' },
  { id: 'pc-14', category: 'delivery', entityNameAr: 'منطقة الجابرية', entityNameEn: 'Jabriya zone', reference: 'DEL-7551', baseAmount: 164, appliedCommissionRate: 8, commissionAmount: 13.12, status: 'Paid', createdAtUtc: '2026-06-16T19:10:00Z' },
  { id: 'pc-15', category: 'service', entityNameAr: 'رسوم إدارة المحافظ', entityNameEn: 'Wallet management fees', reference: 'SRV-6488', baseAmount: 680, appliedCommissionRate: 2.5, commissionAmount: 17, status: 'Paid', createdAtUtc: '2026-06-15T11:40:00Z' },
  { id: 'pc-16', category: 'restaurant', entityNameAr: 'Protein House', entityNameEn: 'Protein House', reference: 'SET-8240', baseAmount: 1240, appliedCommissionRate: 9, commissionAmount: 111.6, status: 'Pending', createdAtUtc: '2026-06-14T08:20:00Z' },
  { id: 'pc-17', category: 'subscription', entityNameAr: 'اشتراك يوسف حسن', entityNameEn: 'Youssef Hassan subscription', reference: 'SUB-10422', baseAmount: 95, appliedCommissionRate: 20, commissionAmount: 19, status: 'Paid', createdAtUtc: '2026-06-13T13:00:00Z' },
  { id: 'pc-18', category: 'delivery', entityNameAr: 'منطقة الفروانية', entityNameEn: 'Farwaniya zone', reference: 'DEL-7429', baseAmount: 212, appliedCommissionRate: 7.5, commissionAmount: 15.9, status: 'Reversed', createdAtUtc: '2026-06-12T17:25:00Z' },
  { id: 'pc-19', category: 'campaign', entityNameAr: 'حملة تحدي 30 يوم', entityNameEn: '30 Day Challenge campaign', reference: 'CAM-1995', baseAmount: 820, appliedCommissionRate: 5, commissionAmount: 41, status: 'Paid', createdAtUtc: '2026-06-11T09:55:00Z' },
  { id: 'pc-20', category: 'restaurant', entityNameAr: 'Balance Bowl', entityNameEn: 'Balance Bowl', reference: 'SET-8176', baseAmount: 560, appliedCommissionRate: 11, commissionAmount: 61.6, status: 'Paid', createdAtUtc: '2026-06-10T12:15:00Z' },
  { id: 'pc-21', category: 'subscription', entityNameAr: 'اشتراك منى إبراهيم', entityNameEn: 'Mona Ibrahim subscription', reference: 'SUB-10389', baseAmount: 79, appliedCommissionRate: 24, commissionAmount: 18.96, status: 'Pending', createdAtUtc: '2026-06-09T14:45:00Z' },
  { id: 'pc-22', category: 'service', entityNameAr: 'رسوم الدفع الإلكتروني', entityNameEn: 'Online payment fees', reference: 'SRV-6310', baseAmount: 950, appliedCommissionRate: 2, commissionAmount: 19, status: 'Paid', createdAtUtc: '2026-06-08T10:05:00Z' },
  { id: 'pc-23', category: 'restaurant', entityNameAr: 'Fresh Table', entityNameEn: 'Fresh Table', reference: 'SET-8084', baseAmount: 1080, appliedCommissionRate: 10, commissionAmount: 108, status: 'Paid', createdAtUtc: '2026-06-06T16:30:00Z' },
  { id: 'pc-24', category: 'delivery', entityNameAr: 'منطقة العاصمة', entityNameEn: 'Capital zone', reference: 'DEL-7298', baseAmount: 185, appliedCommissionRate: 8, commissionAmount: 14.8, status: 'Pending', createdAtUtc: '2026-06-04T18:40:00Z' },
  { id: 'pc-25', category: 'subscription', entityNameAr: 'اشتراك فاطمة عادل', entityNameEn: 'Fatma Adel subscription', reference: 'SUB-10321', baseAmount: 135, appliedCommissionRate: 17, commissionAmount: 22.95, status: 'Paid', createdAtUtc: '2026-06-02T08:35:00Z' },
  { id: 'pc-26', category: 'campaign', entityNameAr: 'حملة رمضان المتوازن', entityNameEn: 'Balanced Ramadan campaign', reference: 'CAM-1922', baseAmount: 1460, appliedCommissionRate: 4, commissionAmount: 58.4, status: 'Paid', createdAtUtc: '2026-05-28T11:10:00Z' },
  { id: 'pc-27', category: 'restaurant', entityNameAr: 'Healthy Corner', entityNameEn: 'Healthy Corner', reference: 'SET-7921', baseAmount: 775, appliedCommissionRate: 12, commissionAmount: 93, status: 'Reversed', createdAtUtc: '2026-05-23T09:25:00Z' },
  { id: 'pc-28', category: 'subscription', entityNameAr: 'اشتراك عمر سامي', entityNameEn: 'Omar Samy subscription', reference: 'SUB-10274', baseAmount: 110, appliedCommissionRate: 19, commissionAmount: 20.9, status: 'Paid', createdAtUtc: '2026-05-18T15:20:00Z' },
  { id: 'pc-29', category: 'service', entityNameAr: 'رسوم خدمة الشركات', entityNameEn: 'Corporate service fees', reference: 'SRV-6084', baseAmount: 1320, appliedCommissionRate: 3, commissionAmount: 39.6, status: 'Paid', createdAtUtc: '2026-05-12T12:00:00Z' },
  { id: 'pc-30', category: 'delivery', entityNameAr: 'منطقة مبارك الكبير', entityNameEn: 'Mubarak Al-Kabeer zone', reference: 'DEL-7014', baseAmount: 148, appliedCommissionRate: 8, commissionAmount: 11.84, status: 'Paid', createdAtUtc: '2026-05-05T17:50:00Z' },
];

@Component({
  selector: 'mm-marketing-reports-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, FormsModule, NgClass, NgIcon, MmTablePaginationComponent],
  providers: [provideIcons({
    lucideBadgeDollarSign, lucideCalendarDays, lucideChartNoAxesCombined,
    lucideChevronDown, lucideCircleCheck, lucideClock3, lucideDownload,
    lucideLink2, lucideSearch, lucideTicketPercent, lucideTrendingUp,
    lucideUsers, lucideWalletCards,
  })],
  templateUrl: './marketing-reports-page.component.html',
  styleUrl: './marketing-reports-page.component.scss',
  host: { class: 'block' },
})
export class MarketingReportsPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);
  readonly periodDays = signal(30);
  readonly influencerFilter = signal('all');
  readonly categoryFilter = signal<'all' | CommissionCategory>('all');
  readonly statusFilter = signal<CommissionStatusFilter>('all');
  readonly searchQuery = signal('');
  readonly dataRefreshing = signal(false);
  readonly pg = createTablePagination(6);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;
  readonly influencers = this.store.influencers;

  readonly text = computed(() => this.locale.isRtl() ? {
    title: 'مركز عمولات المنصة', subtitle: 'تقرير موحّد لكل العمولات المحصّلة والمستحقة على المنصة',
    export: 'تصدير التقرير', period: 'الفترة الزمنية', influencer: 'كل الأطراف', category: 'كل أنواع العمولات',
    subscriptionCat: 'عمولة الاشتراكات', restaurantCat: 'عمولة المطاعم', deliveryCat: 'عمولة التوصيل', influencerCat: 'عمولة المؤثرين', campaignCat: 'عمولة الحملات', serviceCat: 'رسوم تشغيلية',
    last7: 'آخر 7 أيام', last30: 'آخر 30 يومًا', last90: 'آخر 90 يومًا', all: 'الكل',
    revenue: 'إجمالي قيمة العمليات', revenueHint: 'قيمة العمليات قبل خصم العمولة', pending: 'عمولات مستحقة',
    pendingHint: 'تحتاج للمراجعة والصرف', paid: 'عمولات مدفوعة', paidHint: 'تم تسويتها بنجاح',
    conversion: 'معدل التحويل', conversionHint: 'من الزيارات إلى اشتراك', trend: 'أداء الإحالات',
    trendSub: 'حركة العمليات والعمولات خلال الفترة المحددة', revenueLegend: 'قيمة العمليات', commissionLegend: 'عمولة المنصة',
    channels: 'توزيع العمولات', channelsSub: 'نسبة العمولات حسب مصدرها', link: 'اشتراكات ومطاعم', code: 'باقي المصادر',
    leaderboard: 'أكبر مصادر العمولة', leaderboardSub: 'حسب قيمة العمولة المحصّلة', subs: 'د.ك',
    ledger: 'سجل جميع عمولات المنصة', ledgerSub: 'الاشتراكات، المطاعم، التوصيل، المؤثرون، الحملات والرسوم', search: 'ابحث باسم الطرف أو رقم العملية...',
    status: 'كل الحالات', pendingStatus: 'مستحقة', paidStatus: 'مدفوعة', reversedStatus: 'معكوسة',
    colInfluencer: 'الطرف / المصدر', colSubscription: 'رقم العملية', colValue: 'قيمة العملية', colRate: 'النسبة', type: 'نوع العمولة',
    colCommission: 'العمولة', colStatus: 'الحالة', colDate: 'تاريخ الاستحقاق', noData: 'لا توجد عمولات مطابقة',
    items: 'عمولة', vsPrevious: 'مقارنة بالفترة السابقة', currency: 'د.ك', total: 'إجمالي',
  } : {
    title: 'Platform commissions center', subtitle: 'A unified report of every collected and pending platform commission',
    export: 'Export report', period: 'Date range', influencer: 'All parties', category: 'All commission types',
    subscriptionCat: 'Subscription commission', restaurantCat: 'Restaurant commission', deliveryCat: 'Delivery commission', influencerCat: 'Influencer commission', campaignCat: 'Campaign commission', serviceCat: 'Service fees',
    last7: 'Last 7 days', last30: 'Last 30 days', last90: 'Last 90 days', all: 'All',
    revenue: 'Gross transaction value', revenueHint: 'Transaction value before commission', pending: 'Pending commissions',
    pendingHint: 'Require review and payout', paid: 'Paid commissions', paidHint: 'Successfully settled',
    conversion: 'Conversion rate', conversionHint: 'From visits to subscription', trend: 'Referral performance',
    trendSub: 'Transactions and commissions during selected period', revenueLegend: 'Transaction value', commissionLegend: 'Platform commission',
    channels: 'Commission distribution', channelsSub: 'Commission share by source', link: 'Subscriptions & restaurants', code: 'Other sources',
    leaderboard: 'Largest commission sources', leaderboardSub: 'By collected commission value', subs: 'KD',
    ledger: 'All platform commissions', ledgerSub: 'Subscriptions, restaurants, delivery, influencers, campaigns and fees', search: 'Search party or transaction ID...',
    status: 'All statuses', pendingStatus: 'Pending', paidStatus: 'Paid', reversedStatus: 'Reversed',
    colInfluencer: 'Party / source', colSubscription: 'Transaction ID', colValue: 'Transaction value', colRate: 'Rate', type: 'Commission type',
    colCommission: 'Commission', colStatus: 'Status', colDate: 'Due date', noData: 'No matching commissions',
    items: 'commissions', vsPrevious: 'vs previous period', currency: 'KD', total: 'Total',
  });

  readonly allCommissionRows = computed(() => {
    const platform = PLATFORM_COMMISSIONS.map(row => ({
      ...row, influencerId: '', subscriptionId: row.reference, subscriptionAmount: row.baseAmount,
      influencerName: this.locale.isRtl() ? row.entityNameAr : row.entityNameEn,
      initials: (this.locale.isRtl() ? row.entityNameAr : row.entityNameEn).trim().charAt(0),
    }));
    const marketing = this.store.influencers().flatMap(i => i.commissions.map(c => ({
      ...c, category: 'influencer' as CommissionCategory, influencerId: i.id,
      influencerName: this.locale.isRtl() ? i.displayNameAr : i.displayNameEn,
      initials: (this.locale.isRtl() ? i.displayNameAr : i.displayNameEn).trim().charAt(0),
    })));
    return [...platform, ...marketing];
  });

  /** Global report filters: these drive every KPI, chart, breakdown and table. */
  readonly reportRows = computed(() => {
    const category = this.categoryFilter();
    const cutoff = new Date('2026-07-01T23:59:59Z').getTime() - this.periodDays() * 86_400_000;
    return this.allCommissionRows().filter(row =>
      new Date(row.createdAtUtc).getTime() >= cutoff &&
      (category === 'all' || row.category === category),
    );
  });

  readonly commissionRows = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.reportRows().filter(row =>
      (this.influencerFilter() === 'all' || row.influencerId === this.influencerFilter()) &&
      (this.statusFilter() === 'all' || row.status === this.statusFilter()) &&
      (!q || row.influencerName.toLowerCase().includes(q) || row.subscriptionId.toLowerCase().includes(q)),
    );
  });
  readonly paginatedCommissionRows = this.pg.paginated(this.commissionRows);
  readonly totalPages = this.pg.totalPages(this.commissionRows);

  readonly summary = computed(() => {
    const rows = this.reportRows();
    const revenue = rows.reduce((sum, row) => sum + row.subscriptionAmount, 0);
    const pending = rows.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.commissionAmount, 0);
    const paid = rows.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.commissionAmount, 0);
    const referrals = this.store.influencers().reduce((sum, i) => sum + i.stats.referralsCount, 0);
    const subscriptions = this.store.influencers().reduce((sum, i) => sum + i.stats.paidSubscriptionsCount, 0);
    return { revenue, pending, paid, conversion: referrals ? subscriptions / referrals * 100 : 0 };
  });

  readonly channelBreakdown = computed(() => {
    const rows = this.reportRows();
    const link = rows.filter(r => r.category === 'subscription' || r.category === 'restaurant').reduce((s, r) => s + r.commissionAmount, 0);
    const code = rows.filter(r => r.category !== 'subscription' && r.category !== 'restaurant').reduce((s, r) => s + r.commissionAmount, 0);
    const total = Math.max(link + code, 1);
    return { link, code, linkPercent: Math.round(link / total * 100), codePercent: Math.round(code / total * 100) };
  });

  readonly leaderboard = computed(() => [...this.reportRows()]
    .sort((a, b) => b.commissionAmount - a.commissionAmount).slice(0, 4));

  readonly chart = computed(() => {
    const base = this.summary().revenue || 350;
    const factors = this.periodDays() === 7 ? [.52, .68, .61, .78, .72, .92, .84] : [.38, .55, .47, .68, .59, .76, .71, .88, .78, 1, .91, .96];
    const labels = this.periodDays() === 7
      ? (this.locale.isRtl() ? ['س','ح','ن','ث','ر','خ','ج'] : ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'])
      : (this.locale.isRtl() ? ['1','3','5','8','10','13','15','18','20','23','25','28'] : ['1','3','5','8','10','13','15','18','20','23','25','28']);
    return factors.map((factor, index) => ({ label: labels[index], height: Math.round(factor * 100), value: base * factor / 5 }));
  });

  ngOnInit(): void { this.store.load(); }
  resetPage(): void { this.pg.resetPage(); }
  changePeriod(days: number): void {
    this.periodDays.set(days);
    this.refreshDataView();
  }
  changeCategory(category: 'all' | CommissionCategory): void {
    this.categoryFilter.set(category);
    this.refreshDataView();
  }
  private refreshDataView(): void {
    this.pg.resetPage();
    this.dataRefreshing.set(false);
    requestAnimationFrame(() => this.dataRefreshing.set(true));
    setTimeout(() => this.dataRefreshing.set(false), 520);
  }
  onPageChange(page: number): void { this.pg.onPageChange(page, this.totalPages()); }
  statusLabel(status: string): string {
    const t = this.text();
    return status === 'Paid' ? t.paidStatus : status === 'Reversed' ? t.reversedStatus : t.pendingStatus;
  }
  statusClass(status: string): string {
    return status === 'Paid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' :
      status === 'Reversed' ? 'bg-rose-50 text-rose-700 ring-rose-600/15' : 'bg-amber-50 text-amber-700 ring-amber-600/15';
  }
  displayName(item: { displayNameAr: string; displayNameEn: string }): string {
    return this.locale.isRtl() ? item.displayNameAr : item.displayNameEn;
  }
  categoryLabel(category: CommissionCategory): string {
    const t = this.text();
    return ({ subscription: t.subscriptionCat, restaurant: t.restaurantCat, delivery: t.deliveryCat,
      influencer: t.influencerCat, campaign: t.campaignCat, service: t.serviceCat })[category];
  }
  exportCsv(): void {
    const t = this.text();
    const rows = this.commissionRows().map(r => [r.influencerName, r.subscriptionId, r.subscriptionAmount, r.appliedCommissionRate, r.commissionAmount, this.statusLabel(r.status), r.createdAtUtc]);
    const csv = '\uFEFF' + [[t.colInfluencer, t.colSubscription, t.colValue, t.colRate, t.colCommission, t.colStatus, t.colDate], ...rows]
      .map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'marketing-commissions.csv'; anchor.click(); URL.revokeObjectURL(url);
  }
}
