import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBan,
  lucideCircleDollarSign,
  lucideClock,
  lucideEye,
  lucideLayoutTemplate,
  lucideListChecks,
  lucideMapPin,
  lucideMegaphone,
  lucideMousePointerClick,
  lucidePanelTop,
  lucidePlus,
  lucideRotateCcw,
  lucideScrollText,
  lucideSearch,
  lucideShieldCheck,
  lucideTrophy,
  lucideWalletCards,
  lucideX,
} from '@ng-icons/lucide';

import { AdminPermissions } from '@/core/auth/admin-permissions';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmShellCardComponent } from '@/shared/components/layout/shell-card';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { AdsStore } from '../../data/ads-store';
import {
  AdAreaOption,
  AdBidStatus,
  AdPlacementType,
  AdPolicyRule,
  AdSlot,
  AdSlotStatus,
  RestaurantAdBid,
} from '../../models';

type AdsSection = 'placements' | 'audit';
type SlotFilter = 'all' | AdSlotStatus | 'issues';
type BidFilter = 'all' | AdBidStatus | 'policy';
type SlotModalTab = 'bids' | 'preview' | 'policy';

const ADS_COPY = {
  ar: {
    sectionsLabel: 'أقسام الإعلانات',
    sectionPlacements: 'الأماكن',
    sectionAudit: 'السجل',
    sectionPlacementsMetrics: 'مؤشرات الأماكن الإعلانية',
    sectionAuditMetrics: 'مؤشرات السجل',
    newSlot: 'مكان جديد',
    createTitle: 'إنشاء مكان إعلاني',
    createSubtitle: 'حدد المنطقة ومكان الظهور وفترة المزاد.',
    cancel: 'إلغاء',
    create: 'إنشاء',
    selectArea: 'اختر المنطقة',
    selectPlacement: 'اختر مكان الظهور',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    maxWinners: 'عدد الفائزين',
    createHint: 'كل مكان إعلاني يسمح بثلاثة مطاعم فائزة كحد أقصى داخل نفس المنطقة.',
    invalidDates: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية.',
    requiredField: 'يرجى تعبئة جميع الحقول المطلوبة.',
    searchPlaceholder: 'ابحث بالمنطقة أو المطعم...',
    all: 'الكل',
    open: 'مفتوحة',
    closingSoon: 'تغلق قريباً',
    awarded: 'محسومة',
    live: 'نشطة',
    paused: 'متوقفة',
    expired: 'منتهية',
    issues: 'ملاحظات',
    openAuctions: 'مزادات مفتوحة',
    liveSlots: 'أماكن نشطة',
    pendingReview: 'عروض للمراجعة',
    revenue: 'إيراد إعلاني',
    averageCtr: 'متوسط النقرات',
    policyIssues: 'مخالفات التغطية',
    slotsTitle: 'الأماكن الإعلانية',
    bidsTitle: 'عروض المطاعم',
    previewTitle: 'معاينة الظهور',
    policyTitle: 'سياسة الإعلانات',
    auditTitle: 'سجل العمليات',
    slotDetail: 'تفاصيل المكان',
    close: 'إغلاق',
    viewDetails: 'التفاصيل',
    tabBids: 'العروض',
    tabPreview: 'معاينة',
    tabPolicy: 'السياسة',
    area: 'المنطقة',
    placement: 'المكان',
    period: 'الفترة',
    minimumBid: 'الحد الأدنى',
    winners: 'الفائزون',
    impressions: 'الظهور',
    ctr: 'نسبة النقر',
    bid: 'العرض',
    budget: 'ميزانية يومية',
    quality: 'الجودة',
    coverage: 'التغطية',
    creative: 'المحتوى',
    status: 'الحالة',
    actions: 'إجراءات',
    awardTopThree: 'حسم أعلى 3',
    approve: 'اعتماد',
    reject: 'رفض',
    auctionOpen: 'المزاد لا يزال مفتوحاً',
    approveAfterAuction: 'يُتاح الاعتماد وحسم الفائزين بعد انتهاء وقت المزاد فقط.',
    auctionEndsAt: 'ينتهي المزاد',
    auctionEnded: 'انتهى المزاد — يمكنك الاعتماد الآن',
    pause: 'إيقاف',
    reopen: 'إعادة فتح',
    noSlots: 'لا توجد أماكن مطابقة.',
    noBids: 'لا توجد عروض لهذا المكان.',
    noAudit: 'لا توجد أحداث في السجل.',
    coverageOk: 'يغطي المنطقة',
    coverageBad: 'خارج التغطية',
    sponsored: 'إعلان',
    customerArea: 'منطقة العميل',
    placementHomeBanner: 'الرئيسية — بانر',
    placementRestaurantList: 'قائمة المطاعم — مميز',
    placementAreaPage: 'صفحة المنطقة',
    placementRestaurantDetail: 'تفاصيل المطعم — بارز',
    rank: 'ترتيب',
    colActor: 'المستخدم',
    colAction: 'الإجراء',
    colDate: 'التاريخ',
    colDetail: 'التفاصيل',
    kwd: 'د.ك',
  },
  en: {
    sectionsLabel: 'Ads workspace sections',
    sectionPlacements: 'Placements',
    sectionAudit: 'Audit log',
    sectionPlacementsMetrics: 'Placement metrics',
    sectionAuditMetrics: 'Audit metrics',
    newSlot: 'New placement',
    createTitle: 'Create ad placement',
    createSubtitle: 'Choose the area, placement, and auction period.',
    cancel: 'Cancel',
    create: 'Create',
    selectArea: 'Select area',
    selectPlacement: 'Select placement',
    startDate: 'Start date',
    endDate: 'End date',
    maxWinners: 'Max winners',
    createHint: 'Each placement allows up to three winning restaurants in the same area.',
    invalidDates: 'End date must be after the start date.',
    requiredField: 'Please fill in all required fields.',
    searchPlaceholder: 'Search by area or restaurant...',
    all: 'All',
    open: 'Open',
    closingSoon: 'Closing soon',
    awarded: 'Awarded',
    live: 'Live',
    paused: 'Paused',
    expired: 'Expired',
    issues: 'Issues',
    openAuctions: 'Open auctions',
    liveSlots: 'Live placements',
    pendingReview: 'Pending review',
    revenue: 'Ad revenue',
    averageCtr: 'Avg click rate',
    policyIssues: 'Coverage issues',
    slotsTitle: 'Ad placements',
    bidsTitle: 'Restaurant bids',
    previewTitle: 'Customer preview',
    policyTitle: 'Ad policy',
    auditTitle: 'Operations log',
    slotDetail: 'Placement details',
    close: 'Close',
    viewDetails: 'Details',
    tabBids: 'Bids',
    tabPreview: 'Preview',
    tabPolicy: 'Policy',
    area: 'Area',
    placement: 'Placement',
    period: 'Period',
    minimumBid: 'Minimum bid',
    winners: 'Winners',
    impressions: 'Impressions',
    ctr: 'Click rate',
    bid: 'Bid',
    budget: 'Daily budget',
    quality: 'Quality',
    coverage: 'Coverage',
    creative: 'Creative',
    status: 'Status',
    actions: 'Actions',
    awardTopThree: 'Award top 3',
    approve: 'Approve',
    reject: 'Reject',
    auctionOpen: 'Auction still open',
    approveAfterAuction: 'Approval and winner selection are available only after the auction ends.',
    auctionEndsAt: 'Auction ends',
    auctionEnded: 'Auction ended — you can approve bids now',
    pause: 'Pause',
    reopen: 'Reopen',
    noSlots: 'No placements match.',
    noBids: 'No bids for this placement.',
    noAudit: 'No audit events yet.',
    coverageOk: 'Covers area',
    coverageBad: 'Outside coverage',
    sponsored: 'Sponsored',
    customerArea: 'Customer area',
    placementHomeBanner: 'Home — Banner',
    placementRestaurantList: 'Restaurant list — Featured',
    placementAreaPage: 'Area page',
    placementRestaurantDetail: 'Restaurant detail — Highlight',
    rank: 'Rank',
    colActor: 'User',
    colAction: 'Action',
    colDate: 'Date',
    colDetail: 'Details',
    kwd: 'KWD',
  },
} as const;

@Component({
  selector: 'mm-ads-bidding-page',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgIcon,
    ReactiveFormsModule,
    MmShellCardComponent,
    MmOperationsKpiCardComponent,
    HasPermissionDirective,
  ],
  providers: [
    provideIcons({
      lucideBadgeCheck,
      lucideBan,
      lucideCircleDollarSign,
      lucideClock,
      lucideEye,
      lucideLayoutTemplate,
      lucideListChecks,
      lucideMapPin,
      lucideMegaphone,
      lucideMousePointerClick,
      lucidePanelTop,
      lucidePlus,
      lucideRotateCcw,
      lucideScrollText,
      lucideSearch,
      lucideShieldCheck,
      lucideTrophy,
      lucideWalletCards,
      lucideX,
    }),
  ],
  templateUrl: './ads-bidding-page.component.html',
  host: { class: 'block' },
})
export class AdsBiddingPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly locale = inject(AppLocaleService);
  readonly store = inject(AdsStore);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => ADS_COPY[this.locale.locale()]);
  readonly activeSection = signal<AdsSection>('placements');
  readonly searchQuery = signal('');
  readonly slotFilter = signal<SlotFilter>('all');
  readonly bidFilter = signal<BidFilter>('all');
  readonly slotModalOpen = signal(false);
  readonly slotModalTab = signal<SlotModalTab>('bids');
  readonly auditDetailOpen = signal(false);
  readonly selectedAuditId = signal<string | null>(null);
  readonly createModalOpen = signal(false);
  readonly createFormError = signal<string | null>(null);

  readonly createForm = this.fb.nonNullable.group({
    areaId: ['', Validators.required],
    placement: ['area_page_bid' as AdPlacementType, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    minBidKd: [20, [Validators.required, Validators.min(1)]],
    maxWinners: [3, [Validators.required, Validators.min(1), Validators.max(3)]],
  });

  readonly placementOptions = computed(() => {
    const types: AdPlacementType[] = [
      'home_banner',
      'restaurant_list_sponsored',
      'area_page_bid',
      'restaurant_detail_highlight',
    ];
    return types.map((id) => ({ id, label: this.placementLabel(id) }));
  });

  readonly slotFilters = computed(() => {
    const c = this.copy();
    return [
      { id: 'all' as SlotFilter, label: c.all },
      { id: 'Open' as SlotFilter, label: c.open },
      { id: 'ClosingSoon' as SlotFilter, label: c.closingSoon },
      { id: 'Awarded' as SlotFilter, label: c.awarded },
      { id: 'Live' as SlotFilter, label: c.live },
      { id: 'issues' as SlotFilter, label: c.issues },
    ];
  });

  readonly bidFilters = computed(() => {
    const c = this.copy();
    return [
      { id: 'all' as BidFilter, label: c.all },
      { id: 'Pending' as BidFilter, label: c.pendingReview },
      { id: 'Leading' as BidFilter, label: c.open },
      { id: 'Winning' as BidFilter, label: c.winners },
      { id: 'Approved' as BidFilter, label: c.approve },
      { id: 'Rejected' as BidFilter, label: c.reject },
      { id: 'policy' as BidFilter, label: c.issues },
    ];
  });

  readonly sectionMetricsLabel = computed(() =>
    this.activeSection() === 'audit' ? this.copy().sectionAuditMetrics : this.copy().sectionPlacementsMetrics,
  );

  readonly filteredSlots = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.slotFilter();

    return this.store.slots().filter((slot) => {
      if (filter === 'issues' && !this.slotHasPolicyIssue(slot)) return false;
      if (filter !== 'all' && filter !== 'issues' && slot.status !== filter) return false;
      if (!q) return true;

      const bids = this.store.bids().filter((bid) => bid.slotId === slot.id);
      const haystack = [
        slot.id,
        slot.areaNameAr,
        slot.areaNameEn,
        this.placementLabel(slot.placement),
        ...bids.flatMap((bid) => [bid.restaurantNameAr, bid.restaurantNameEn]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  });

  readonly visibleBids = computed(() => {
    const slot = this.store.selectedSlot();
    if (!slot) return [];

    const filter = this.bidFilter();
    return this.store
      .selectedBids()
      .filter((bid) => {
        if (filter === 'policy') return !this.bidCoversSlot(bid, slot);
        if (filter === 'all') return true;
        return bid.status === filter;
      })
      .sort((a, b) => b.bidAmountKd - a.bidAmountKd || b.qualityScore - a.qualityScore);
  });

  readonly previewBid = computed(() => {
    const bids = this.visibleBids();
    return (
      bids.find((bid) => bid.status === 'Approved' || bid.status === 'Winning' || bid.status === 'Leading') ??
      bids[0] ??
      null
    );
  });

  readonly selectedCoverageIssues = computed(() => {
    const slot = this.store.selectedSlot();
    return slot ? this.store.selectedBids().filter((bid) => !this.bidCoversSlot(bid, slot)) : [];
  });

  readonly selectedAuditEvent = computed(() => {
    const id = this.selectedAuditId();
    return id ? this.store.audit().find((e) => e.id === id) ?? null : null;
  });

  ngOnInit(): void {
    this.store.load();
  }

  setSection(section: AdsSection): void {
    this.activeSection.set(section);
  }

  sectionNavClass(section: AdsSection): string {
    const base =
      'flex w-full min-h-8 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-[0.6875rem] font-bold leading-snug whitespace-nowrap transition-[color,background,box-shadow,border-color] duration-150';
    if (this.activeSection() === section) {
      return `${base} border-emerald-200/70 bg-white text-emerald-700 shadow-[0_1px_2px_rgba(15,29,50,0.05),inset_0_0_0_1px_rgba(255,255,255,0.85)]`;
    }
    return `${base} text-slate-500 hover:bg-white/55 hover:text-slate-700`;
  }

  sectionIconClass(section: AdsSection): string {
    return this.activeSection() === section ? 'text-emerald-600' : 'text-slate-400';
  }

  slotModalTabClass(tab: SlotModalTab): string {
    return this.slotModalTab() === tab
      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50';
  }

  setSlotModalTab(tab: SlotModalTab): void {
    this.slotModalTab.set(tab);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  setSlotFilter(filter: SlotFilter): void {
    this.slotFilter.set(filter);
  }

  setBidFilter(filter: BidFilter): void {
    this.bidFilter.set(filter);
  }

  openSlotDetail(slot: AdSlot): void {
    this.store.selectSlot(slot.id);
    this.bidFilter.set('all');
    this.slotModalTab.set('bids');
    this.slotModalOpen.set(true);
  }

  closeSlotDetail(): void {
    this.slotModalOpen.set(false);
  }

  openAuditDetail(id: string): void {
    this.selectedAuditId.set(id);
    this.auditDetailOpen.set(true);
  }

  closeAuditDetail(): void {
    this.auditDetailOpen.set(false);
    this.selectedAuditId.set(null);
  }

  openCreateSlotModal(): void {
    const defaultArea = this.store.areas[0];
    const start = new Date();
    const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);

    this.createForm.reset({
      areaId: defaultArea?.id ?? '',
      placement: 'area_page_bid',
      startDate: this.toDateInputValue(start),
      endDate: this.toDateInputValue(end),
      minBidKd: 20,
      maxWinners: 3,
    });
    this.createFormError.set(null);
    this.createModalOpen.set(true);
  }

  closeCreateSlotModal(): void {
    this.createModalOpen.set(false);
    this.createFormError.set(null);
  }

  submitCreateSlot(): void {
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      this.createFormError.set(this.copy().requiredField);
      return;
    }

    const value = this.createForm.getRawValue();
    const startAt = new Date(`${value.startDate}T00:00:00`);
    const endAt = new Date(`${value.endDate}T23:59:59`);
    if (endAt <= startAt) {
      this.createFormError.set(this.copy().invalidDates);
      return;
    }

    const area = this.store.areas.find((item) => item.id === value.areaId);
    if (!area) {
      this.createFormError.set(this.copy().requiredField);
      return;
    }

    this.store.createSlot({
      areaId: area.id,
      areaNameAr: area.nameAr,
      areaNameEn: area.nameEn,
      placement: value.placement,
      maxWinners: value.maxWinners,
      minBidKd: value.minBidKd,
      startAtUtc: startAt.toISOString(),
      endAtUtc: endAt.toISOString(),
    });

    this.closeCreateSlotModal();
    this.slotFilter.set('all');
    const created = this.store.selectedSlot();
    if (created) this.openSlotDetail(created);
  }

  areaLabel(area: AdAreaOption): string {
    return this.locale.isRtl() ? area.nameAr : area.nameEn;
  }

  private toDateInputValue(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  canApproveBids(slot: AdSlot): boolean {
    return this.store.isAuctionEnded(slot);
  }

  awardSelected(slot: AdSlot): void {
    this.store.awardTopThree(slot.id);
  }

  statusLabel(status: AdSlotStatus): string {
    const map: Record<AdSlotStatus, { ar: string; en: string }> = {
      Open: { ar: this.copy().open, en: this.copy().open },
      ClosingSoon: { ar: this.copy().closingSoon, en: this.copy().closingSoon },
      Awarded: { ar: this.copy().awarded, en: this.copy().awarded },
      Live: { ar: this.copy().live, en: this.copy().live },
      Paused: { ar: this.copy().paused, en: this.copy().paused },
      Expired: { ar: this.copy().expired, en: this.copy().expired },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  bidStatusLabel(status: AdBidStatus): string {
    const map: Record<AdBidStatus, { ar: string; en: string }> = {
      Pending: { ar: 'قيد المراجعة', en: 'Pending' },
      Leading: { ar: 'متصدر', en: 'Leading' },
      Winning: { ar: 'فائز', en: 'Winning' },
      Approved: { ar: 'معتمد', en: 'Approved' },
      Outbid: { ar: 'خسر المزايدة', en: 'Outbid' },
      Rejected: { ar: 'مرفوض', en: 'Rejected' },
    };
    return this.locale.isRtl() ? map[status].ar : map[status].en;
  }

  placementLabel(placement: AdPlacementType): string {
    const c = this.copy();
    const map: Record<AdPlacementType, string> = {
      home_banner: c.placementHomeBanner,
      restaurant_list_sponsored: c.placementRestaurantList,
      area_page_bid: c.placementAreaPage,
      restaurant_detail_highlight: c.placementRestaurantDetail,
    };
    return map[placement];
  }

  statusClass(status: AdSlotStatus): string {
    const map: Record<AdSlotStatus, string> = {
      Open: 'bg-blue-50 text-blue-700 ring-blue-200',
      ClosingSoon: 'bg-amber-50 text-amber-700 ring-amber-200',
      Awarded: 'bg-violet-50 text-violet-700 ring-violet-200',
      Live: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      Paused: 'bg-slate-100 text-slate-600 ring-slate-200',
      Expired: 'bg-rose-50 text-rose-700 ring-rose-200',
    };
    return map[status];
  }

  bidStatusClass(status: AdBidStatus): string {
    const map: Record<AdBidStatus, string> = {
      Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
      Leading: 'bg-blue-50 text-blue-700 ring-blue-200',
      Winning: 'bg-violet-50 text-violet-700 ring-violet-200',
      Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      Outbid: 'bg-slate-100 text-slate-600 ring-slate-200',
      Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
    };
    return map[status];
  }

  filterClass(filter: SlotFilter): string {
    return this.slotFilter() === filter
      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50';
  }

  policyClass(rule: AdPolicyRule): string {
    const map: Record<AdPolicyRule['severity'], string> = {
      info: 'border-blue-100 bg-blue-50 text-blue-800',
      warning: 'border-amber-100 bg-amber-50 text-amber-800',
      danger: 'border-rose-100 bg-rose-50 text-rose-800',
    };
    return map[rule.severity];
  }

  bidCoversSlot(bid: RestaurantAdBid, slot: AdSlot): boolean {
    return bid.serviceAreasAr.includes(slot.areaNameAr) || bid.serviceAreasEn.includes(slot.areaNameEn);
  }

  slotHasPolicyIssue(slot: AdSlot): boolean {
    return this.store.bids().some((bid) => bid.slotId === slot.id && !this.bidCoversSlot(bid, slot));
  }

  winnerCount(slot: AdSlot): number {
    if (slot.winnerBidIds.length) return slot.winnerBidIds.length;
    return this.store
      .bids()
      .filter((bid) => bid.slotId === slot.id && (bid.status === 'Winning' || bid.status === 'Approved')).length;
  }

  bidRank(slot: AdSlot, bid: RestaurantAdBid): number {
    const ranked = this.store
      .bids()
      .filter((item) => item.slotId === slot.id && item.status !== 'Rejected')
      .sort((a, b) => b.bidAmountKd - a.bidAmountKd || b.qualityScore - a.qualityScore);
    return ranked.findIndex((item) => item.id === bid.id) + 1;
  }

  slotCtr(slot: AdSlot): number {
    return slot.impressions ? Math.round((slot.clicks / slot.impressions) * 1000) / 10 : 0;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale.isRtl() ? 'ar-KW' : 'en-US').format(value);
  }

  formatKd(value: number): string {
    return `${new Intl.NumberFormat(this.locale.isRtl() ? 'ar-KW' : 'en-US', {
      maximumFractionDigits: value % 1 ? 1 : 0,
    }).format(value)} ${this.copy().kwd}`;
  }

  areaName(slot: AdSlot): string {
    return this.locale.isRtl() ? slot.areaNameAr : slot.areaNameEn;
  }

  restaurantName(bid: RestaurantAdBid): string {
    return this.locale.isRtl() ? bid.restaurantNameAr : bid.restaurantNameEn;
  }

  creativeHeadline(bid: RestaurantAdBid): string {
    return this.locale.isRtl() ? bid.creative.headlineAr : bid.creative.headlineEn;
  }

  creativeDescription(bid: RestaurantAdBid): string {
    return this.locale.isRtl() ? bid.creative.descriptionAr : bid.creative.descriptionEn;
  }

  creativeCta(bid: RestaurantAdBid): string {
    return this.locale.isRtl() ? bid.creative.ctaAr : bid.creative.ctaEn;
  }

  serviceAreas(bid: RestaurantAdBid): string {
    return (this.locale.isRtl() ? bid.serviceAreasAr : bid.serviceAreasEn).join('، ');
  }

  policyTitle(rule: AdPolicyRule): string {
    return this.locale.isRtl() ? rule.titleAr : rule.titleEn;
  }

  policyDescription(rule: AdPolicyRule): string {
    return this.locale.isRtl() ? rule.descriptionAr : rule.descriptionEn;
  }
}
