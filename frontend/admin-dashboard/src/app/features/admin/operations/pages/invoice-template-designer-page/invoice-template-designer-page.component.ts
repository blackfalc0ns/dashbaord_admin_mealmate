import { Component, DestroyRef, ElementRef, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideArrowLeft,
  lucideBarcode,
  lucideCopy,
  lucideDownload,
  lucideEye,
  lucideFileText,
  lucideLanguages,
  lucideLayoutTemplate,
  lucideLock,
  lucideMapPin,
  lucideMove,
  lucidePalette,
  lucidePrinter,
  lucideQrCode,
  lucideRotateCw,
  lucideSave,
  lucideSettings,
  lucideTable2,
  lucideTags,
  lucideTrash2,
  lucideTriangleAlert,
  lucideUser,
  lucideUtensils,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';
import { DocumentPdfService } from '../../data/document-pdf.service';
import { InvoiceLabelsStore } from '../../data/invoice-labels-store';
import {
  DocumentTemplate,
  TemplateElement,
  TemplateElementKind,
} from '../../models/document-template.model';
import { DocumentTemplatePreviewComponent } from '../../components/invoices/document-template-preview.component';

type RailTab = 'elements' | 'template';

@Component({
  selector: 'mm-invoice-template-designer-page',
  standalone: true,
  imports: [RouterLink, NgIcon, DocumentTemplatePreviewComponent],
  providers: [
    provideIcons({
      lucideArchive,
      lucideArrowLeft,
      lucideBarcode,
      lucideCopy,
      lucideDownload,
      lucideEye,
      lucideFileText,
      lucideLanguages,
      lucideLayoutTemplate,
      lucideLock,
      lucideMapPin,
      lucideMove,
      lucidePalette,
      lucidePrinter,
      lucideQrCode,
      lucideRotateCw,
      lucideSave,
      lucideSettings,
      lucideTable2,
      lucideTags,
      lucideTrash2,
      lucideTriangleAlert,
      lucideUser,
      lucideUtensils,
      lucideX,
    }),
  ],
  templateUrl: './invoice-template-designer-page.component.html',
  host: { class: 'block' },
})
export class InvoiceTemplateDesignerPageComponent implements OnInit {
  private readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);
  readonly store = inject(InvoiceLabelsStore);
  private readonly pdf = inject(DocumentPdfService);

  @ViewChild('pdfSurface') private readonly pdfSurface?: ElementRef<HTMLElement>;

  readonly templateId = signal<string | null>(null);
  readonly isRtl = computed(() => this.locale.isRtl());
  readonly copy = computed(() => (this.isRtl() ? AR_COPY : EN_COPY));
  readonly railTab = signal<RailTab>('elements');
  readonly sampleOrderId = signal(this.store.sampleOrders()[0]?.orderId ?? '');
  readonly mealIndex = signal(0);
  readonly toast = signal<string | null>(null);
  readonly exporting = signal(false);
  readonly previewOpen = signal(false);

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
    { kind: 'customer-name', icon: 'lucideUser' },
    { kind: 'customer-address', icon: 'lucideMapPin' },
  ];

  readonly template = computed(() => {
    const id = this.templateId();
    if (!id) return null;
    return this.store.templates().find((item) => item.id === id) ?? null;
  });

  readonly selectedElement = this.store.selectedElement;
  readonly sampleOrder = computed(() => {
    const id = this.sampleOrderId();
    return this.store.sampleOrders().find((order) => order.orderId === id) ?? this.store.sampleOrders()[0];
  });

  constructor() {
    effect(() => {
      const tpl = this.template();
      if (!tpl) return;
      this.pageContext.customTitle.set(this.templateName(tpl));
      this.pageContext.customDescription.set(this.copy().designerTitle);
      this.pageContext.customBreadcrumbs.set([
        { label: this.isRtl() ? 'العمليات' : 'Operations' },
        { label: this.isRtl() ? 'الفواتير والملصقات' : 'Invoices & labels', route: '/admin/operations/invoices' },
        { label: this.templateName(tpl), active: true },
      ]);
    });

    this.destroyRef.onDestroy(() => {
      this.pageContext.customTitle.set(null);
      this.pageContext.customDescription.set(null);
      this.pageContext.customBreadcrumbs.set(null);
      this.store.selectElement(null);
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.templateId.set(id);
    if (id) this.store.selectTemplate(id);
  }

  setRailTab(tab: RailTab): void {
    this.railTab.set(tab);
  }

  railTabClass(tab: RailTab): string {
    return this.railTab() === tab
      ? 'bg-emerald-600 text-white shadow-sm'
      : 'text-slate-500 hover:bg-slate-100';
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

  updateElementStyleNumber(field: 'fontSize' | 'radius' | 'padding', event: Event): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.updateElement(element.id, {
      style: { [field]: Math.max(Number(this.inputValue(event)) || 0, 0) },
    });
  }

  updateElementStyleColor(field: 'color' | 'backgroundColor' | 'borderColor', event: Event): void {
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

  deleteSelectedElement(): void {
    const element = this.selectedElement();
    if (!element) return;
    this.store.deleteElement(element.id);
    this.showToast(this.copy().elementDeleted);
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
    void this.router.navigate(['/admin/operations/invoices']);
  }

  duplicate(): void {
    const newId = this.store.duplicateSelected();
    this.showToast(this.copy().duplicated);
    if (newId) {
      this.templateId.set(newId);
      void this.router.navigate(['/admin/operations/invoices', newId, 'design'], { replaceUrl: true });
    }
  }

  openPreview(): void {
    this.previewOpen.set(true);
  }

  closePreview(): void {
    this.previewOpen.set(false);
  }

  async exportPdf(): Promise<void> {
    const tpl = this.template();
    const order = this.sampleOrder();
    const surface = this.pdfSurface?.nativeElement.querySelector('.mm-template-canvas');
    if (!tpl || !order || !(surface instanceof HTMLElement)) return;

    this.exporting.set(true);
    try {
      await this.pdf.exportTemplateElement(surface, tpl, `${tpl.kind}-${order.orderId}-${tpl.id}.pdf`);
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

  elementKindLabel(kind: TemplateElementKind): string {
    return this.copy().elementKinds[kind];
  }

  statusLabel(status: DocumentTemplate['status']): string {
    return this.copy().statuses[status];
  }

  statusClass(status: DocumentTemplate['status']): string {
    return {
      draft: 'bg-amber-50 text-amber-700 ring-amber-100',
      published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      archived: 'bg-slate-100 text-slate-600 ring-slate-200',
    }[status];
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
  back: 'Back to templates',
  notFound: 'Template not found.',
  designerTitle: 'Template designer',
  preview: 'Preview',
  previewTitle: 'Live preview',
  saveDraft: 'Save draft',
  publish: 'Publish',
  duplicate: 'Duplicate',
  archive: 'Archive',
  editorTab: 'Canvas',
  settingsTab: 'Template',
  elementsTab: 'Add elements',
  inspector: 'Inspector',
  noElement: 'Select an element on the canvas.',
  inspectorEmpty: 'No element selected',
  deselect: 'Deselect',
  delete: 'Delete',
  dragHint: 'Drag elements on the canvas to position them.',
  elementsTitle: 'Elements',
  elementsHint: 'Click any block to add it to the canvas.',
  pageSize: 'Page size',
  colors: 'Colors',
  logos: 'Logos',
  content: 'Content',
  box: 'Box',
  typography: 'Typography',
  state: 'State',
  sampleOrder: 'Sample order',
  sampleMeal: 'Sample meal',
  exportPdf: 'Export PDF',
  exporting: 'Exporting...',
  reissue: 'Reissue',
  close: 'Close',
  draftSaved: 'Draft saved locally.',
  published: 'Template published.',
  archived: 'Template archived.',
  duplicated: 'Template duplicated.',
  elementDeleted: 'Element removed.',
  pdfReady: 'PDF generated.',
  pdfFailed: 'PDF generation failed.',
  reissued: 'Document reissued.',
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
};

const AR_COPY: typeof EN_COPY = {
  back: 'العودة للقوالب',
  notFound: 'القالب غير موجود.',
  designerTitle: 'مصمم القالب',
  preview: 'معاينة',
  previewTitle: 'معاينة حية',
  saveDraft: 'حفظ مسودة',
  publish: 'نشر',
  duplicate: 'نسخ',
  archive: 'أرشفة',
  editorTab: 'المساحة',
  settingsTab: 'القالب',
  elementsTab: 'إضافة عناصر',
  inspector: 'تعديل العنصر',
  noElement: 'اختر عنصرًا من مساحة التصميم.',
  inspectorEmpty: 'لا يوجد عنصر محدد',
  deselect: 'إلغاء التحديد',
  delete: 'حذف',
  dragHint: 'اسحب العناصر في المساحة لتحريكها.',
  elementsTitle: 'العناصر',
  elementsHint: 'اضغط على أي كتلة لإضافتها للمساحة.',
  pageSize: 'حجم الصفحة',
  colors: 'الألوان',
  logos: 'الشعارات',
  content: 'المحتوى',
  box: 'المربع',
  typography: 'الخط',
  state: 'الحالة',
  sampleOrder: 'طلب تجريبي',
  sampleMeal: 'وجبة تجريبية',
  exportPdf: 'تصدير PDF',
  exporting: 'جاري التصدير...',
  reissue: 'إعادة إصدار',
  close: 'إغلاق',
  draftSaved: 'تم حفظ المسودة.',
  published: 'تم نشر القالب.',
  archived: 'تمت الأرشفة.',
  duplicated: 'تم نسخ القالب.',
  elementDeleted: 'تم حذف العنصر.',
  pdfReady: 'تم توليد PDF.',
  pdfFailed: 'فشل توليد PDF.',
  reissued: 'تمت إعادة الإصدار.',
  statuses: { draft: 'مسودة', published: 'منشور', archived: 'مؤرشف' },
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
};
