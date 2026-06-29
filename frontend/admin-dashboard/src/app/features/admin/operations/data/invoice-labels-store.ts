import { Injectable, computed, signal } from '@angular/core';

import {
  DOCUMENT_TEMPLATES_MOCK,
  GENERATED_DOCUMENTS_MOCK,
  INVOICE_ORDER_SAMPLES,
  TEMPLATE_AUDIT_MOCK,
} from './invoice-labels.mock';
import {
  DocumentTemplate,
  DocumentTemplateKind,
  DocumentTemplateLanguage,
  GeneratedDocument,
  TemplateAuditEvent,
  TemplateElement,
  TemplateElementKind,
  TemplateElementPatch,
} from '../models/document-template.model';

type TemplatePatch = Partial<
  Pick<
    DocumentTemplate,
    | 'nameAr'
    | 'nameEn'
    | 'descriptionAr'
    | 'descriptionEn'
    | 'language'
    | 'widthPx'
    | 'heightPx'
    | 'marginPx'
    | 'backgroundColor'
    | 'accentColor'
    | 'showAppLogo'
    | 'showRestaurantLogo'
  >
>;

@Injectable({ providedIn: 'root' })
export class InvoiceLabelsStore {
  readonly templates = signal<DocumentTemplate[]>(structuredClone(DOCUMENT_TEMPLATES_MOCK));
  readonly generatedDocuments = signal<GeneratedDocument[]>(structuredClone(GENERATED_DOCUMENTS_MOCK));
  readonly auditEvents = signal<TemplateAuditEvent[]>(structuredClone(TEMPLATE_AUDIT_MOCK));
  readonly sampleOrders = signal(structuredClone(INVOICE_ORDER_SAMPLES));
  readonly selectedTemplateId = signal(DOCUMENT_TEMPLATES_MOCK[0]?.id ?? null);
  readonly selectedElementId = signal<string | null>(null);

  readonly selectedTemplate = computed(() => {
    const id = this.selectedTemplateId();
    return this.templates().find((template) => template.id === id) ?? this.templates()[0] ?? null;
  });

  readonly selectedElement = computed(() => {
    const template = this.selectedTemplate();
    const id = this.selectedElementId();
    if (!template || !id) return null;
    return template.elements.find((element) => element.id === id) ?? null;
  });

  readonly kpis = computed(() => {
    const templates = this.templates();
    const docs = this.generatedDocuments();
    return {
      totalTemplates: templates.length,
      invoices: templates.filter((template) => template.kind === 'invoice').length,
      labels: templates.filter((template) => template.kind === 'label').length,
      published: templates.filter((template) => template.status === 'published').length,
      generated: docs.filter((doc) => doc.status !== 'voided').length,
      reissued: docs.filter((doc) => doc.status === 'reissued').length,
    };
  });

  selectTemplate(id: string): void {
    this.selectedTemplateId.set(id);
    this.selectedElementId.set(null);
  }

  selectElement(id: string | null): void {
    this.selectedElementId.set(id);
  }

  createTemplate(kind: DocumentTemplateKind): void {
    const base = kind === 'invoice' ? this.templates().find((t) => t.kind === 'invoice') : this.templates().find((t) => t.kind === 'label');
    if (!base) return;

    const created = this.cloneTemplate(base, {
      id: `TPL-${kind.toUpperCase()}-${Date.now()}`,
      status: 'draft',
      nameAr: kind === 'invoice' ? 'قالب فاتورة جديد' : 'قالب ملصق جديد',
      nameEn: kind === 'invoice' ? 'New invoice template' : 'New label template',
      version: 1,
    });

    this.templates.update((templates) => [created, ...templates]);
    this.selectedTemplateId.set(created.id);
    this.selectedElementId.set(null);
    this.appendAudit(created.id, 'Create', 'Created from default template.');
  }

  duplicateSelected(): void {
    const current = this.selectedTemplate();
    if (!current) return;

    const copy = this.cloneTemplate(current, {
      id: `TPL-COPY-${Date.now()}`,
      status: 'draft',
      nameAr: `${current.nameAr} - نسخة`,
      nameEn: `${current.nameEn} - Copy`,
      version: 1,
    });

    this.templates.update((templates) => [copy, ...templates]);
    this.selectedTemplateId.set(copy.id);
    this.selectedElementId.set(null);
    this.appendAudit(copy.id, 'Duplicate', `Duplicated from ${current.id}.`);
  }

  updateSelectedTemplate(patch: TemplatePatch): void {
    const current = this.selectedTemplate();
    if (!current) return;

    this.templates.update((templates) =>
      templates.map((template) =>
        template.id === current.id
          ? {
              ...template,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : template,
      ),
    );
  }

  updateElement(elementId: string, patch: TemplateElementPatch): void {
    const current = this.selectedTemplate();
    if (!current) return;

    this.templates.update((templates) =>
      templates.map((template) =>
        template.id === current.id
          ? {
              ...template,
              updatedAt: new Date().toISOString(),
              elements: template.elements.map((element) =>
                element.id === elementId
                  ? {
                      ...element,
                      ...patch,
                      style: patch.style ? { ...element.style, ...patch.style } : element.style,
                    }
                  : element,
              ),
            }
          : template,
      ),
    );
  }

  moveElement(elementId: string, dx: number, dy: number): void {
    const template = this.selectedTemplate();
    const element = template?.elements.find((item) => item.id === elementId);
    if (!template || !element || element.locked) return;

    this.updateElement(elementId, {
      width: element.width,
      height: element.height,
    });

    const nextX = Math.min(Math.max(element.x + Math.round(dx), 0), Math.max(template.widthPx - element.width, 0));
    const nextY = Math.min(Math.max(element.y + Math.round(dy), 0), Math.max(template.heightPx - element.height, 0));

    this.templates.update((templates) =>
      templates.map((item) =>
        item.id === template.id
          ? {
              ...item,
              updatedAt: new Date().toISOString(),
              elements: item.elements.map((candidate) =>
                candidate.id === elementId ? { ...candidate, x: nextX, y: nextY } : candidate,
              ),
            }
          : item,
      ),
    );
  }

  addElement(kind: TemplateElementKind): void {
    const template = this.selectedTemplate();
    if (!template) return;

    const sourceByKind: Record<TemplateElementKind, TemplateElement['source']> = {
      logo: 'static',
      text: 'static',
      'bilingual-text': 'static',
      table: 'meal-details',
      'nutrition-block': 'nutrition',
      'allergy-notes': 'allergies',
      barcode: 'barcode',
      'qr-code': 'barcode',
      totals: 'totals',
      'meal-details': 'meal-details',
    };
    const id = `EL-${Date.now()}`;
    const element: TemplateElement = {
      id,
      kind,
      source: sourceByKind[kind],
      labelAr: this.elementKindLabel(kind, 'ar'),
      labelEn: this.elementKindLabel(kind, 'en'),
      textAr: this.elementKindLabel(kind, 'ar'),
      textEn: this.elementKindLabel(kind, 'en'),
      x: template.marginPx,
      y: template.marginPx,
      width: kind === 'barcode' || kind === 'qr-code' ? 190 : 230,
      height: kind === 'table' ? 180 : kind === 'nutrition-block' ? 82 : 68,
      visible: true,
      locked: false,
      zIndex: template.elements.length + 1,
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: '#0f172a',
        backgroundColor: kind === 'text' || kind === 'bilingual-text' ? '#f8fafc' : 'transparent',
        borderColor: '#e2e8f0',
        radius: 8,
        padding: 10,
        align: 'start',
      },
    };

    this.templates.update((templates) =>
      templates.map((item) =>
        item.id === template.id
          ? {
              ...item,
              updatedAt: new Date().toISOString(),
              elements: [...item.elements, element],
            }
          : item,
      ),
    );
    this.selectedElementId.set(id);
  }

  saveDraft(): void {
    const template = this.selectedTemplate();
    if (!template) return;
    this.updateTemplateStatus(template.id, 'draft');
    this.appendAudit(template.id, 'SaveDraft', 'Template draft saved locally.');
  }

  publishSelected(): void {
    const template = this.selectedTemplate();
    if (!template) return;
    this.updateTemplateStatus(template.id, 'published');
    this.appendAudit(template.id, 'Publish', 'Template published for −24h generation.');
  }

  archiveSelected(): void {
    const template = this.selectedTemplate();
    if (!template) return;
    this.updateTemplateStatus(template.id, 'archived');
    this.appendAudit(template.id, 'Archive', 'Template archived from operations workspace.');
  }

  recordPdfGenerated(orderId: string): void {
    const template = this.selectedTemplate();
    if (!template) return;
    this.generatedDocuments.update((docs) => [
      {
        id: `DOC-${Date.now()}`,
        templateId: template.id,
        kind: template.kind,
        orderId,
        status: 'generated',
        generatedAt: new Date().toISOString(),
        actorName: 'Operations - Current User',
        reason: 'Manual PDF export from admin workspace',
      },
      ...docs,
    ]);
    this.appendAudit(template.id, 'GeneratePdf', `Generated PDF for ${orderId}.`);
  }

  reissue(orderId: string): void {
    const template = this.selectedTemplate();
    if (!template) return;
    this.generatedDocuments.update((docs) => [
      {
        id: `DOC-RE-${Date.now()}`,
        templateId: template.id,
        kind: template.kind,
        orderId,
        status: 'reissued',
        generatedAt: new Date().toISOString(),
        actorName: 'Operations - Current User',
        reason: 'Manual reissue after admin exception',
      },
      ...docs,
    ]);
    this.appendAudit(template.id, 'Reissue', `Reissued document for ${orderId}.`);
  }

  auditForTemplate(templateId: string): TemplateAuditEvent[] {
    return this.auditEvents().filter((event) => event.templateId === templateId);
  }

  private updateTemplateStatus(id: string, status: DocumentTemplate['status']): void {
    this.templates.update((templates) =>
      templates.map((template) =>
        template.id === id
          ? {
              ...template,
              status,
              version: template.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : template,
      ),
    );
  }

  private appendAudit(
    templateId: string,
    action: TemplateAuditEvent['action'],
    reason: string,
  ): void {
    this.auditEvents.update((events) => [
      {
        id: `AUD-${Date.now()}`,
        templateId,
        action,
        actorName: 'Operations - Current User',
        reason,
        createdAt: new Date().toISOString(),
      },
      ...events,
    ]);
  }

  private cloneTemplate(
    source: DocumentTemplate,
    overrides: Partial<DocumentTemplate>,
  ): DocumentTemplate {
    const id = overrides.id ?? `TPL-${Date.now()}`;
    return {
      ...structuredClone(source),
      ...overrides,
      id,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Operations - Current User',
      elements: source.elements.map((element, index) => ({
        ...structuredClone(element),
        id: `${id}-EL-${index + 1}`,
      })),
    };
  }

  private elementKindLabel(kind: TemplateElementKind, lang: DocumentTemplateLanguage): string {
    const labels: Record<TemplateElementKind, { ar: string; en: string }> = {
      logo: { ar: 'شعار', en: 'Logo' },
      text: { ar: 'نص', en: 'Text' },
      'bilingual-text': { ar: 'نص ثنائي', en: 'Bilingual text' },
      table: { ar: 'جدول', en: 'Table' },
      'nutrition-block': { ar: 'قيم غذائية', en: 'Nutrition' },
      'allergy-notes': { ar: 'حساسية', en: 'Allergy notes' },
      barcode: { ar: 'باركود', en: 'Barcode' },
      'qr-code': { ar: 'QR', en: 'QR' },
      totals: { ar: 'إجماليات', en: 'Totals' },
      'meal-details': { ar: 'تفاصيل وجبة', en: 'Meal details' },
    };
    return lang === 'ar' ? labels[kind].ar : labels[kind].en;
  }
}
