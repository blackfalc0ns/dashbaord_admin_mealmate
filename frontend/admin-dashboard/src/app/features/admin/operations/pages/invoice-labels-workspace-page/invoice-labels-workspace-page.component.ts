import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideDownload,
  lucideEye,
  lucideFileText,
  lucideHistory,
  lucideLayoutTemplate,
  lucidePenLine,
  lucidePlus,
  lucidePrinter,
  lucideRotateCw,
  lucideScrollText,
  lucideSearch,
  lucideTags,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmShellCardComponent } from '@/shared/components/layout/shell-card';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { DocumentPdfService } from '../../data/document-pdf.service';
import { InvoiceLabelsStore } from '../../data/invoice-labels-store';
import {
  DocumentTemplate,
  DocumentTemplateKind,
  DocumentTemplateStatus,
  GeneratedDocument,
  TemplateAuditEvent,
} from '../../models/document-template.model';
import { DocumentTemplatePreviewComponent } from '../../components/invoices/document-template-preview.component';

type TemplateFilter = 'all' | DocumentTemplateKind | DocumentTemplateStatus;
type InvoiceSection = 'templates' | 'generated' | 'audit';

@Component({
  selector: 'mm-invoice-labels-workspace-page',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgIcon,
    MmShellCardComponent,
    MmOperationsKpiCardComponent,
    DocumentTemplatePreviewComponent,
  ],
  providers: [
    provideIcons({
      lucideCopy,
      lucideDownload,
      lucideEye,
      lucideFileText,
      lucideHistory,
      lucideLayoutTemplate,
      lucidePenLine,
      lucidePlus,
      lucidePrinter,
      lucideRotateCw,
      lucideScrollText,
      lucideSearch,
      lucideTags,
      lucideX,
    }),
  ],
  templateUrl: './invoice-labels-workspace-page.component.html',
  host: { class: 'block' },
})
export class InvoiceLabelsWorkspacePageComponent {
  private readonly locale = inject(AppLocaleService);
  private readonly router = inject(Router);
  readonly store = inject(InvoiceLabelsStore);
  private readonly pdf = inject(DocumentPdfService);

  @ViewChild('pdfSurface') private readonly pdfSurface?: ElementRef<HTMLElement>;

  readonly isRtl = computed(() => this.locale.isRtl());
  readonly copy = computed(() => (this.isRtl() ? AR_COPY : EN_COPY));
  readonly activeSection = signal<InvoiceSection>('templates');
  readonly activeFilter = signal<TemplateFilter>('all');
  readonly searchQuery = signal('');
  readonly sampleOrderId = signal(this.store.sampleOrders()[0]?.orderId ?? '');
  readonly mealIndex = signal(0);
  readonly toast = signal<string | null>(null);
  readonly exporting = signal(false);
  readonly previewOpen = signal(false);
  readonly historyDetailOpen = signal(false);
  readonly selectedHistoryDoc = signal<GeneratedDocument | null>(null);
  readonly selectedAuditEvent = signal<TemplateAuditEvent | null>(null);
  readonly auditDetailOpen = signal(false);

  readonly filters: TemplateFilter[] = ['all', 'invoice', 'label', 'published', 'draft', 'archived'];

  readonly filteredTemplates = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();
    return this.store.templates().filter((template) => {
      const matchesFilter =
        filter === 'all' || template.kind === filter || template.status === filter;
      const matchesSearch =
        !q ||
        template.nameAr.toLowerCase().includes(q) ||
        template.nameEn.toLowerCase().includes(q) ||
        template.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  });

  readonly allGeneratedDocuments = computed(() =>
    [...this.store.generatedDocuments()].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
    ),
  );

  readonly allAuditEvents = computed(() =>
    [...this.store.auditEvents()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  readonly selectedTemplate = this.store.selectedTemplate;
  readonly sampleOrder = computed(() => {
    const id = this.sampleOrderId();
    return this.store.sampleOrders().find((order) => order.orderId === id) ?? this.store.sampleOrders()[0];
  });

  readonly sectionMetricsLabel = computed(() => {
    switch (this.activeSection()) {
      case 'generated':
        return this.copy().sectionGeneratedMetrics;
      case 'audit':
        return this.copy().sectionAuditMetrics;
      default:
        return this.copy().sectionTemplatesMetrics;
    }
  });

  setSection(section: InvoiceSection): void {
    this.activeSection.set(section);
  }

  sectionNavClass(section: InvoiceSection): string {
    const base =
      'flex w-full min-h-8 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-[0.6875rem] font-bold leading-snug whitespace-nowrap transition-[color,background,box-shadow,border-color] duration-150';
    if (this.activeSection() === section) {
      return `${base} border-emerald-200/70 bg-white text-emerald-700 shadow-[0_1px_2px_rgba(15,29,50,0.05),inset_0_0_0_1px_rgba(255,255,255,0.85)]`;
    }
    return `${base} text-slate-500 hover:bg-white/55 hover:text-slate-700`;
  }

  sectionIconClass(section: InvoiceSection): string {
    return this.activeSection() === section ? 'text-emerald-600' : 'text-slate-400';
  }

  onSearch(event: Event): void {
    this.searchQuery.set(this.inputValue(event));
  }

  setFilter(filter: TemplateFilter): void {
    this.activeFilter.set(filter);
  }

  createAndDesign(kind: DocumentTemplateKind): void {
    const id = this.store.createTemplate(kind);
    if (id) void this.router.navigate(['/admin/operations/invoices', id, 'design']);
  }

  navigateToDesigner(template: DocumentTemplate): void {
    this.store.selectTemplate(template.id);
    void this.router.navigate(['/admin/operations/invoices', template.id, 'design']);
  }

  openPreview(template?: DocumentTemplate): void {
    if (template) {
      this.store.selectTemplate(template.id);
      this.mealIndex.set(0);
    }
    if (!this.selectedTemplate()) return;
    this.previewOpen.set(true);
  }

  closePreview(): void {
    this.previewOpen.set(false);
  }

  openHistoryDetail(doc: GeneratedDocument): void {
    this.selectedHistoryDoc.set(doc);
    const template = this.store.templates().find((t) => t.id === doc.templateId);
    if (template) {
      this.store.selectTemplate(template.id);
    }
    this.historyDetailOpen.set(true);
  }

  closeHistoryDetail(): void {
    this.historyDetailOpen.set(false);
    this.selectedHistoryDoc.set(null);
  }

  openAuditDetail(event: TemplateAuditEvent): void {
    this.selectedAuditEvent.set(event);
    this.auditDetailOpen.set(true);
  }

  closeAuditDetail(): void {
    this.auditDetailOpen.set(false);
    this.selectedAuditEvent.set(null);
  }

  selectSample(event: Event): void {
    this.sampleOrderId.set(this.selectValue(event));
    this.mealIndex.set(0);
  }

  selectMeal(event: Event): void {
    this.mealIndex.set(Number(this.selectValue(event)));
  }

  duplicate(template?: DocumentTemplate): void {
    if (template) this.store.selectTemplate(template.id);
    this.store.duplicateSelected();
    this.showToast(this.copy().duplicated);
  }

  async exportPdf(): Promise<void> {
    const template = this.selectedTemplate();
    const order = this.sampleOrder();
    const surface = this.pdfSurface?.nativeElement.querySelector('.mm-template-canvas');
    if (!template || !order || !(surface instanceof HTMLElement)) return;

    this.exporting.set(true);
    try {
      await this.pdf.exportTemplateElement(
        surface,
        template,
        `${template.kind}-${order.orderId}-${template.id}.pdf`,
      );
      this.store.recordPdfGenerated(order.orderId);
      this.showToast(this.copy().pdfReady);
    } catch {
      this.showToast(this.copy().pdfFailed);
    } finally {
      this.exporting.set(false);
    }
  }

  reissue(): void {
    const order = this.sampleOrder();
    if (!order) return;
    this.store.reissue(order.orderId);
    this.showToast(this.copy().reissued);
  }

  templateName(template: DocumentTemplate): string {
    return this.isRtl() ? template.nameAr : template.nameEn;
  }

  templateDescription(template: DocumentTemplate): string {
    return this.isRtl() ? template.descriptionAr : template.descriptionEn;
  }

  templateForId(id: string): DocumentTemplate | undefined {
    return this.store.templates().find((t) => t.id === id);
  }

  kindLabel(kind: DocumentTemplateKind): string {
    return this.copy().kinds[kind];
  }

  statusLabel(status: DocumentTemplateStatus): string {
    return this.copy().statuses[status];
  }

  docStatusLabel(status: GeneratedDocument['status']): string {
    return this.copy().docStatuses[status];
  }

  filterLabel(filter: TemplateFilter): string {
    if (filter === 'all') return this.copy().all;
    if (filter === 'invoice' || filter === 'label') return this.kindLabel(filter);
    return this.statusLabel(filter);
  }

  statusClass(status: DocumentTemplateStatus): string {
    return {
      draft: 'bg-amber-50 text-amber-700 ring-amber-100',
      published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      archived: 'bg-slate-100 text-slate-600 ring-slate-200',
    }[status];
  }

  docStatusClass(status: GeneratedDocument['status']): string {
    return {
      generated: 'bg-sky-50 text-sky-700 ring-sky-100',
      printed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      reissued: 'bg-amber-50 text-amber-700 ring-amber-100',
      voided: 'bg-slate-100 text-slate-600 ring-slate-200',
    }[status];
  }

  filterClass(filter: TemplateFilter): string {
    return this.activeFilter() === filter
      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50';
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2600);
  }

  private inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}

const EN_COPY = {
  sectionsLabel: 'Invoices workspace sections',
  sectionTemplates: 'Templates',
  sectionGenerated: 'Generated',
  sectionAudit: 'Audit log',
  sectionTemplatesMetrics: 'Template catalog metrics',
  sectionGeneratedMetrics: 'Generated documents metrics',
  sectionAuditMetrics: 'Audit activity metrics',
  search: 'Search templates...',
  all: 'All',
  createInvoice: 'New invoice',
  createLabel: 'New label',
  templates: 'Templates',
  designer: 'Designer',
  preview: 'Preview',
  settings: 'Settings',
  elements: 'Elements',
  inspector: 'Inspector',
  noElement: 'Select an element on the canvas.',
  sampleOrder: 'Sample order',
  sampleMeal: 'Sample meal',
  exportPdf: 'Export PDF',
  exporting: 'Exporting...',
  reissue: 'Reissue',
  saveDraft: 'Save draft',
  publish: 'Publish',
  duplicate: 'Duplicate',
  archive: 'Archive',
  design: 'Design',
  viewDetails: 'Details',
  close: 'Close',
  colName: 'Template',
  colKind: 'Type',
  colStatus: 'Status',
  colVersion: 'Version',
  colPage: 'Page size',
  colUpdated: 'Updated',
  colActions: 'Actions',
  colOrder: 'Order',
  colDocument: 'Document',
  colActor: 'Actor',
  colReason: 'Reason',
  colDate: 'Date',
  colAction: 'Action',
  noRows: 'No templates match this filter.',
  noDocuments: 'No generated documents yet.',
  noAudit: 'No audit events yet.',
  draftSaved: 'Draft saved locally.',
  published: 'Template published.',
  archived: 'Template archived.',
  duplicated: 'Template duplicated.',
  pdfReady: 'PDF generated.',
  pdfFailed: 'PDF generation failed.',
  reissued: 'Document reissued.',
  privacyNote: 'Labels hide customer name, phone, and full address.',
  designerTitle: 'Template designer',
  previewTitle: 'Live preview',
  historyTitle: 'Document details',
  auditTitle: 'Audit event',
  editorTab: 'Canvas',
  settingsTab: 'Template',
  elementsTab: 'Add elements',
  kinds: { invoice: 'Invoice', label: 'Label' },
  statuses: { draft: 'Draft', published: 'Published', archived: 'Archived' },
  docStatuses: {
    generated: 'Generated',
    printed: 'Printed',
    reissued: 'Reissued',
    voided: 'Voided',
  },
  languages: { ar: 'Arabic', en: 'English', both: 'Bilingual' },
  aligns: { start: 'Start', center: 'Center', end: 'End' },
  elementKinds: {
    logo: 'Logo',
    text: 'Text',
    'bilingual-text': 'Bilingual text',
    table: 'Meals table',
    'nutrition-block': 'Nutrition',
    'allergy-notes': 'Allergies',
    barcode: 'Barcode',
    'qr-code': 'QR',
    totals: 'Totals',
    'meal-details': 'Meal details',
    'customer-name': 'Customer name',
    'customer-address': 'Customer address',
  },
  nameAr: 'Arabic name',
  nameEn: 'English name',
  descAr: 'Arabic description',
  descEn: 'English description',
  language: 'Language',
  width: 'Width',
  height: 'Height',
  margin: 'Margin',
  background: 'Background',
  accent: 'Accent',
  appLogo: 'App logo',
  restaurantLogo: 'Restaurant logo',
  textAr: 'Arabic text',
  textEn: 'English text',
  visible: 'Visible',
  locked: 'Locked',
  fontSize: 'Font size',
  fontWeight: 'Weight',
  radius: 'Radius',
  padding: 'Padding',
  align: 'Align',
  foreground: 'Text',
  elementBg: 'Background',
  border: 'Border',
  history: 'Generated documents',
  audit: 'Template audit',
  kpiTemplates: 'Templates',
  kpiTemplatesDesc: 'Invoice + label templates',
  kpiInvoices: 'Invoices',
  kpiInvoicesDesc: 'Restaurant invoice layouts',
  kpiLabels: 'Labels',
  kpiLabelsDesc: 'Meal label layouts',
  kpiPublished: 'Published',
  kpiPublishedDesc: 'Live for −24h generation',
  kpiGenerated: 'Generated',
  kpiGeneratedDesc: 'Documents created',
  kpiReissued: 'Reissued',
  kpiReissuedDesc: 'Admin exception reprints',
};

const AR_COPY: typeof EN_COPY = {
  sectionsLabel: 'أقسام مساحة الفواتير',
  sectionTemplates: 'القوالب',
  sectionGenerated: 'المستندات',
  sectionAudit: 'السجل',
  sectionTemplatesMetrics: 'مؤشرات كتالوج القوالب',
  sectionGeneratedMetrics: 'مؤشرات المستندات المولدة',
  sectionAuditMetrics: 'مؤشرات نشاط السجل',
  search: 'ابحث في القوالب...',
  all: 'الكل',
  createInvoice: 'فاتورة جديدة',
  createLabel: 'ملصق جديد',
  templates: 'القوالب',
  designer: 'المصمم',
  preview: 'معاينة',
  settings: 'الإعدادات',
  elements: 'العناصر',
  inspector: 'تعديل العنصر',
  noElement: 'اختر عنصرًا من مساحة التصميم.',
  sampleOrder: 'طلب تجريبي',
  sampleMeal: 'وجبة تجريبية',
  exportPdf: 'تصدير PDF',
  exporting: 'جاري التصدير...',
  reissue: 'إعادة إصدار',
  saveDraft: 'حفظ مسودة',
  publish: 'نشر',
  duplicate: 'نسخ',
  archive: 'أرشفة',
  design: 'تصميم',
  viewDetails: 'التفاصيل',
  close: 'إغلاق',
  colName: 'القالب',
  colKind: 'النوع',
  colStatus: 'الحالة',
  colVersion: 'الإصدار',
  colPage: 'حجم الصفحة',
  colUpdated: 'آخر تحديث',
  colActions: 'إجراءات',
  colOrder: 'الطلب',
  colDocument: 'المستند',
  colActor: 'المستخدم',
  colReason: 'السبب',
  colDate: 'التاريخ',
  colAction: 'الإجراء',
  noRows: 'لا توجد قوالب مطابقة.',
  noDocuments: 'لا توجد مستندات مولدة بعد.',
  noAudit: 'لا توجد أحداث في السجل.',
  draftSaved: 'تم حفظ المسودة.',
  published: 'تم نشر القالب.',
  archived: 'تمت الأرشفة.',
  duplicated: 'تم نسخ القالب.',
  pdfReady: 'تم توليد PDF.',
  pdfFailed: 'فشل توليد PDF.',
  reissued: 'تمت إعادة الإصدار.',
  privacyNote: 'الملصقات لا تعرض اسم العميل أو الهاتف أو العنوان الكامل.',
  designerTitle: 'مصمم القالب',
  previewTitle: 'معاينة حية',
  historyTitle: 'تفاصيل المستند',
  auditTitle: 'حدث السجل',
  editorTab: 'المساحة',
  settingsTab: 'القالب',
  elementsTab: 'إضافة عناصر',
  kinds: { invoice: 'فاتورة', label: 'ملصق' },
  statuses: { draft: 'مسودة', published: 'منشور', archived: 'مؤرشف' },
  docStatuses: {
    generated: 'مولّد',
    printed: 'مطبوع',
    reissued: 'أُعيد إصداره',
    voided: 'ملغى',
  },
  languages: { ar: 'عربي', en: 'إنجليزي', both: 'ثنائي' },
  aligns: { start: 'بداية', center: 'وسط', end: 'نهاية' },
  elementKinds: {
    logo: 'شعار',
    text: 'نص',
    'bilingual-text': 'نص ثنائي',
    table: 'جدول الوجبات',
    'nutrition-block': 'قيم غذائية',
    'allergy-notes': 'الحساسية',
    barcode: 'باركود',
    'qr-code': 'QR',
    totals: 'إجماليات',
    'meal-details': 'تفاصيل الوجبة',
    'customer-name': 'اسم العميل',
    'customer-address': 'عنوان العميل',
  },
  nameAr: 'اسم عربي',
  nameEn: 'اسم إنجليزي',
  descAr: 'وصف عربي',
  descEn: 'وصف إنجليزي',
  language: 'اللغة',
  width: 'العرض',
  height: 'الارتفاع',
  margin: 'الهامش',
  background: 'الخلفية',
  accent: 'اللون الرئيسي',
  appLogo: 'لوجو التطبيق',
  restaurantLogo: 'لوجو المطعم',
  textAr: 'النص العربي',
  textEn: 'النص الإنجليزي',
  visible: 'ظاهر',
  locked: 'مقفل',
  fontSize: 'حجم الخط',
  fontWeight: 'السماكة',
  radius: 'الزوايا',
  padding: 'المسافة',
  align: 'المحاذاة',
  foreground: 'النص',
  elementBg: 'الخلفية',
  border: 'الإطار',
  history: 'المستندات المولدة',
  audit: 'سجل القوالب',
  kpiTemplates: 'القوالب',
  kpiTemplatesDesc: 'قوالب الفواتير والملصقات',
  kpiInvoices: 'الفواتير',
  kpiInvoicesDesc: 'تخطيطات فواتير المطاعم',
  kpiLabels: 'الملصقات',
  kpiLabelsDesc: 'تخطيطات ملصقات الوجبات',
  kpiPublished: 'منشور',
  kpiPublishedDesc: 'جاهز لتوليد −24 ساعة',
  kpiGenerated: 'مولّد',
  kpiGeneratedDesc: 'مستندات تم إنشاؤها',
  kpiReissued: 'أُعيد إصداره',
  kpiReissuedDesc: 'إعادة طباعة باستثناء إداري',
};
