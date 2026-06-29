export type DocumentTemplateKind = 'invoice' | 'label';
export type DocumentTemplateStatus = 'draft' | 'published' | 'archived';
export type DocumentTemplateLanguage = 'ar' | 'en' | 'both';

export type TemplateElementKind =
  | 'logo'
  | 'text'
  | 'bilingual-text'
  | 'table'
  | 'nutrition-block'
  | 'allergy-notes'
  | 'barcode'
  | 'qr-code'
  | 'totals'
  | 'meal-details';

export type TemplateElementSource =
  | 'static'
  | 'order-id'
  | 'restaurant'
  | 'delivery-date'
  | 'meal-name'
  | 'meal-details'
  | 'allergies'
  | 'nutrition'
  | 'barcode'
  | 'totals'
  | 'status'
  | 'print-batch';

export interface TemplateElementStyle {
  fontSize: number;
  fontWeight: 400 | 500 | 600 | 700 | 800;
  color: string;
  backgroundColor: string;
  borderColor: string;
  radius: number;
  padding: number;
  align: 'start' | 'center' | 'end';
}

export interface TemplateElement {
  id: string;
  kind: TemplateElementKind;
  source: TemplateElementSource;
  labelAr: string;
  labelEn: string;
  textAr: string;
  textEn: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  style: TemplateElementStyle;
}

export interface DocumentTemplate {
  id: string;
  kind: DocumentTemplateKind;
  status: DocumentTemplateStatus;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  language: DocumentTemplateLanguage;
  widthPx: number;
  heightPx: number;
  pageSizeLabel: string;
  marginPx: number;
  backgroundColor: string;
  accentColor: string;
  showAppLogo: boolean;
  showRestaurantLogo: boolean;
  version: number;
  updatedAt: string;
  updatedBy: string;
  elements: TemplateElement[];
}

export interface MealLabelSnapshot {
  id: string;
  mealNameAr: string;
  mealNameEn: string;
  ingredientsAr: string;
  ingredientsEn: string;
  allergensAr: string;
  allergensEn: string;
  prepNotesAr: string;
  prepNotesEn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface InvoiceOrderSnapshot {
  orderId: string;
  restaurantNameAr: string;
  restaurantNameEn: string;
  restaurantLogoLabel: string;
  deliveryDate: string;
  deliveryWindow: string;
  orderStatusAr: string;
  orderStatusEn: string;
  printBatch: string;
  subscriptionDayAr: string;
  subscriptionDayEn: string;
  barcodeText: string;
  meals: MealLabelSnapshot[];
  totals: {
    mealsCount: number;
    subtotalKd: number;
    platformFeeKd: number;
    payableKd: number;
  };
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  kind: DocumentTemplateKind;
  orderId: string;
  status: 'generated' | 'printed' | 'reissued' | 'voided';
  generatedAt: string;
  actorName: string;
  reason: string;
}

export interface TemplateAuditEvent {
  id: string;
  templateId: string;
  action: 'Create' | 'Duplicate' | 'SaveDraft' | 'Publish' | 'Archive' | 'GeneratePdf' | 'Reissue';
  actorName: string;
  reason: string;
  createdAt: string;
}

export interface TemplateElementPatch {
  textAr?: string;
  textEn?: string;
  width?: number;
  height?: number;
  visible?: boolean;
  locked?: boolean;
  style?: Partial<TemplateElementStyle>;
}
