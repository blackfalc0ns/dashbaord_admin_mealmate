import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideBarcode,
  lucideCopy,
  lucideDownload,
  lucideEye,
  lucideFileText,
  lucideLanguages,
  lucideLayoutTemplate,
  lucideLock,
  lucideLockOpen,
  lucideMove,
  lucidePalette,
  lucidePlus,
  lucidePrinter,
  lucideQrCode,
  lucideRotateCw,
  lucideSave,
  lucideSearch,
  lucideSettings,
  lucideTable2,
  lucideTags,
  lucideTriangleAlert,
  lucideUtensils,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { DocumentPdfService } from '../../data/document-pdf.service';
import { InvoiceLabelsStore } from '../../data/invoice-labels-store';
import {
  DocumentTemplate,
  DocumentTemplateKind,
  DocumentTemplateStatus,
  TemplateElement,
  TemplateElementKind,
} from '../../models/document-template.model';
import { DocumentTemplatePreviewComponent } from '../../components/invoices/document-template-preview.component';

type TemplateFilter = 'all' | DocumentTemplateKind | DocumentTemplateStatus;

@Component({
  selector: 'mm-invoice-labels-workspace-page',
  standalone: true,
  imports: [DatePipe, NgClass, NgIcon, MmOperationsKpiCardComponent, DocumentTemplatePreviewComponent],
  providers: [
    provideIcons({
      lucideArchive,
      lucideBarcode,
      lucideCopy,
      lucideDownload,
      lucideEye,
      lucideFileText,
      lucideLanguages,
      lucideLayoutTemplate,
      lucideLock,
      lucideLockOpen,
      lucideMove,
      lucidePalette,
      lucidePlus,
      lucidePrinter,
      lucideQrCode,
      lucideRotateCw,
      lucideSave,
      lucideSearch,
      lucideSettings,
      lucideTable2,
      lucideTags,
      lucideTriangleAlert,
      lucideUtensils,
    }),
  ],
  templateUrl: './invoice-labels-workspace-page.component.html',
  host: { class: 'block' },
})
export class InvoiceLabelsWorkspacePageComponent {
  private readonly locale = inject(AppLocaleService);
  readonly store = inject(InvoiceLabelsStore);
  private readonly pdf = inject(DocumentPdfService);

  @ViewChild('pdfSurface') private readonly pdfSurface?: ElementRef<HTMLElement>;

  readonly isRtl = computed(() => this.locale.isRtl());
  readonly copy = computed(() => (this.isRtl() ? AR_COPY : EN_COPY));
  readonly activeFilter = signal<TemplateFilter>('all');
  readonly searchQuery = signal('');
  readonly sampleOrderId = signal(this.store.sampleOrders()[0]?.orderId ?? '');
  readonly mealIndex = signal(0);
  readonly toast = signal<string | null>(null);
  readonly exporting = signal(false);

  readonly filters: TemplateFilter[] = ['all', 'invoice', 'label', 'published', 'draft', 'archived'];
  readonly palette: Array<{ kind: TemplateElementKind; icon: string }> = [
    { kind: 'text', icon: 'lucideFileText' },
    { kind: 'bilingual-text', icon: 'lucideLanguages' },
    { kind: 'logo', icon: 'lucideLayoutTemplate' },
    { kind: 'table', icon: 'lucideTable2' },
    { kind: 'nutrition-block', icon: 'lucideUtensils' },
    { kind: 'allergy-notes', icon: 'lucideTriangleAlert' },
    { kind: 'barcode', icon: 'lucideBarcode' },
    { kind: 'qr-code', icon: 'lucideQrCode' },
    { kind: 'totals', icon: 'lucidePrinter' },
    { kind: 'meal-details', icon: 'lucideTags' },
  ];

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

  readonly selectedTemplate = this.store.selectedTemplate;
  readonly selectedElement = this.store.selectedElement;
  readonly sampleOrder = computed(() => {
    const id = this.sampleOrderId();
    return this.store.sampleOrders().find((order) => order.orderId === id) ?? this.store.sampleOrders()[0];
  });
  readonly selectedAudit = computed(() => {
    const template = this.selectedTemplate();
    return template ? this.store.auditForTemplate(template.id).slice(0, 5) : [];
  });
  readonly selectedHistory = computed(() => {
    const template = this.selectedTemplate();
    const order = this.sampleOrder();
    if (!template || !order) return [];
    return this.store
      .generatedDocuments()
      .filter((doc) => doc.templateId === template.id || doc.orderId === order.orderId)
      .slice(0, 5);
  });

  onSearch(event: Event): void {
    this.searchQuery.set(this.inputValue(event));
  }

  setFilter(filter: TemplateFilter): void {
    this.activeFilter.set(filter);
  }

  selectTemplate(template: DocumentTemplate): void {
    this.store.selectTemplate(template.id);
    this.mealIndex.set(0);
  }

  selectSample(event: Event): void {
    this.sampleOrderId.set(this.selectValue(event));
    this.mealIndex.set(0);
  }

  selectMeal(event: Event): void {
    this.mealIndex.set(Number(this.selectValue(event)));
  }

  updateTemplateText(field: 'nameAr' | 'nameEn' | 'descriptionAr' | 'descriptionEn', event: Event): void {
    this.store.updateSelectedTemplate({ [field]: this.inputValue(event) });
  }

  updateTemplateNumber(field: 'widthPx' | 'heightPx' | 'marginPx', event: Event): void {
    const value = Math.max(Number(this.inputValue(event)) || 0, field === 'marginPx' ? 0 : 180);
    this.store.updateSelectedTemplate({ [field]: value });
  }

  updateTemplateColor(field: 'backgroundColor' | 'accentColor', event: Event): void {
    this.store.updateSelectedTemplate({ [field]: this.inputValue(event) });
  }

  updateTemplateLanguage(event: Event): void {
    const language = this.selectValue(event) as DocumentTemplate['language'];
    this.store.updateSelectedTemplate({ language });
  }

  toggleTemplate(field: 'showAppLogo' | 'showRestaurantLogo', event: Event): void {
    this.store.updateSelectedTemplate({ [field]: (event.target as HTMLInputElement).checked });
  }

  updateElementText(field: 'textAr' | 'textEn', event: Event): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.updateElement(element.id, { [field]: this.inputValue(event) });
  }

  updateElementNumber(field: 'width' | 'height', event: Event): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.updateElement(element.id, { [field]: Math.max(Number(this.inputValue(event)) || 0, 24) });
  }

  updateElementStyleNumber(
    field: 'fontSize' | 'radius' | 'padding',
    event: Event,
  ): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.updateElement(element.id, {
      style: { [field]: Math.max(Number(this.inputValue(event)) || 0, 0) },
    });
  }

  updateElementStyleColor(
    field: 'color' | 'backgroundColor' | 'borderColor',
    event: Event,
  ): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.updateElement(element.id, { style: { [field]: this.inputValue(event) } });
  }

  updateElementWeight(event: Event): void {
    const element = this.selectedElement();
    if (!element) return;
    const fontWeight = Number(this.selectValue(event)) as TemplateElement['style']['fontWeight'];
    this.store.updateElement(element.id, { style: { fontWeight } });
  }

  updateElementAlign(event: Event): void {
    const element = this.selectedElement();
    if (!element) return;
    const align = this.selectValue(event) as TemplateElement['style']['align'];
    this.store.updateElement(element.id, { style: { align } });
  }

  toggleElement(field: 'visible' | 'locked', event: Event): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.updateElement(element.id, { [field]: (event.target as HTMLInputElement).checked });
  }

  onElementMoved(event: { id: string; dx: number; dy: number }): void {
    this.store.moveElement(event.id, event.dx, event.dy);
  }

  saveDraft(): void {
    this.store.saveDraft();
    this.showToast(this.copy().draftSaved);
  }

  publish(): void {
    this.store.publishSelected();
    this.showToast(this.copy().published);
  }

  archive(): void {
    this.store.archiveSelected();
    this.showToast(this.copy().archived);
  }

  duplicate(): void {
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

  kindLabel(kind: DocumentTemplateKind): string {
    return this.copy().kinds[kind];
  }

  statusLabel(status: DocumentTemplateStatus): string {
    return this.copy().statuses[status];
  }

  filterLabel(filter: TemplateFilter): string {
    if (filter === 'all') return this.copy().all;
    if (filter === 'invoice' || filter === 'label') return this.kindLabel(filter);
    return this.statusLabel(filter);
  }

  elementKindLabel(kind: TemplateElementKind): string {
    return this.copy().elementKinds[kind];
  }

  statusClass(status: DocumentTemplateStatus): string {
    return {
      draft: 'bg-amber-50 text-amber-700 ring-amber-100',
      published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      archived: 'bg-slate-100 text-slate-600 ring-slate-200',
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
  title: 'Invoices & labels',
  subtitle: 'Template designer for −24h invoices, driver barcodes, and meal box labels.',
  search: 'Search templates...',
  all: 'All',
  createInvoice: 'Invoice',
  createLabel: 'Label',
  templates: 'Templates',
  editor: 'Drag editor',
  preview: 'Live preview',
  settings: 'Settings',
  elements: 'Elements',
  inspector: 'Inspector',
  noElement: 'Select an element on the canvas.',
  sampleOrder: 'Sample order',
  sampleMeal: 'Sample meal',
  exportPdf: 'PDF',
  exporting: 'Exporting...',
  reissue: 'Reissue',
  saveDraft: 'Save draft',
  publish: 'Publish',
  duplicate: 'Duplicate',
  archive: 'Archive',
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
  elementSize: 'Size',
  colors: 'Colors',
  typography: 'Typography',
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
  noRows: 'No templates match this filter.',
  draftSaved: 'Draft saved locally.',
  published: 'Template published.',
  archived: 'Template archived.',
  duplicated: 'Template duplicated.',
  pdfReady: 'PDF generated.',
  pdfFailed: 'PDF generation failed.',
  reissued: 'Document reissued.',
  privacyNote: 'Labels hide customer name, phone, and full address.',
  kinds: { invoice: 'Invoice', label: 'Label' },
  statuses: { draft: 'Draft', published: 'Published', archived: 'Archived' },
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
  },
};

const AR_COPY: typeof EN_COPY = {
  title: 'الفواتير والملصقات',
  subtitle: 'محرر قوالب لفواتير −24h وباركود السائق وملصقات بوكسات الوجبات.',
  search: 'ابحث في القوالب...',
  all: 'الكل',
  createInvoice: 'فاتورة',
  createLabel: 'ملصق',
  templates: 'القوالب',
  editor: 'محرر السحب',
  preview: 'معاينة حية',
  settings: 'الإعدادات',
  elements: 'العناصر',
  inspector: 'تعديل العنصر',
  noElement: 'اختر عنصرًا من مساحة التصميم.',
  sampleOrder: 'طلب تجريبي',
  sampleMeal: 'وجبة تجريبية',
  exportPdf: 'PDF',
  exporting: 'جاري التصدير...',
  reissue: 'إعادة إصدار',
  saveDraft: 'حفظ مسودة',
  publish: 'نشر',
  duplicate: 'نسخ',
  archive: 'أرشفة',
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
  elementSize: 'الأبعاد',
  colors: 'الألوان',
  typography: 'الخط',
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
  audit: 'سجل القالب',
  noRows: 'لا توجد قوالب مطابقة لهذا الفلتر.',
  draftSaved: 'تم حفظ المسودة محليًا.',
  published: 'تم نشر القالب.',
  archived: 'تمت أرشفة القالب.',
  duplicated: 'تم نسخ القالب.',
  pdfReady: 'تم توليد PDF.',
  pdfFailed: 'فشل توليد PDF.',
  reissued: 'تمت إعادة إصدار المستند.',
  privacyNote: 'الملصقات لا تعرض اسم العميل أو الهاتف أو العنوان الكامل.',
  kinds: { invoice: 'فاتورة', label: 'ملصق' },
  statuses: { draft: 'مسودة', published: 'منشور', archived: 'مؤرشف' },
  languages: { ar: 'عربي', en: 'إنجليزي', both: 'ثنائي اللغة' },
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
  },
};
