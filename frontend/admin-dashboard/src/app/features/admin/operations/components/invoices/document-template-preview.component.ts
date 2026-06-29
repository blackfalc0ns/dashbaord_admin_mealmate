import { NgClass, NgStyle } from '@angular/common';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, output } from '@angular/core';

import {
  DocumentTemplate,
  InvoiceOrderSnapshot,
  MealLabelSnapshot,
  TemplateElement,
} from '../../models/document-template.model';
import { BarcodeCanvasComponent } from './barcode-canvas.component';

@Component({
  selector: 'mm-document-template-preview',
  standalone: true,
  imports: [CdkDrag, NgClass, NgStyle, BarcodeCanvasComponent],
  template: `
    @if (template && sample) {
      <div class="overflow-auto">
        <div
          class="mm-template-canvas relative shrink-0 overflow-hidden border border-slate-200 bg-white shadow-sm"
          [attr.dir]="isRtl ? 'rtl' : 'ltr'"
          [ngStyle]="canvasStyle()"
          (click)="editable && selected.emit(null)"
        >
          @for (element of visibleElements(); track element.id) {
            <div
              cdkDrag
              class="absolute select-none overflow-hidden border transition"
              [cdkDragDisabled]="!editable || element.locked"
              [ngClass]="elementClass(element)"
              [ngStyle]="elementStyle(element)"
              (click)="onSelect($event, element.id)"
              (cdkDragEnded)="onDragEnded($event, element)"
            >
              @switch (element.kind) {
                @case ('logo') {
                  <div class="flex h-full items-center justify-center gap-2 text-center">
                    @if (template.showAppLogo) {
                      <div class="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-xs font-extrabold text-white">MM</div>
                    }
                    @if (template.showRestaurantLogo) {
                      <div class="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-extrabold text-slate-700">
                        {{ sample.restaurantLogoLabel }}
                      </div>
                    }
                    <div class="min-w-0">
                      <p class="truncate text-xs font-extrabold">MealMate</p>
                      <p class="truncate text-[10px] text-slate-500">{{ restaurantName() }}</p>
                    </div>
                  </div>
                }
                @case ('barcode') {
                  <mm-barcode-canvas
                    [value]="sample.barcodeText"
                    bcid="code128"
                    [foreground]="element.style.color"
                    [background]="solidBackground(element)"
                  />
                }
                @case ('qr-code') {
                  <mm-barcode-canvas
                    [value]="sample.barcodeText"
                    bcid="qrcode"
                    [foreground]="element.style.color"
                    [background]="solidBackground(element)"
                  />
                }
                @case ('table') {
                  <div class="h-full overflow-hidden">
                    <div class="grid grid-cols-[1fr_4.5rem_4.5rem_4.5rem_4.5rem] gap-1 border-b border-slate-200 pb-2 text-[11px] font-extrabold text-slate-500">
                      <span>{{ isRtl ? 'الوجبة' : 'Meal' }}</span>
                      <span>{{ isRtl ? 'سعرات' : 'Kcal' }}</span>
                      <span>{{ isRtl ? 'بروتين' : 'Protein' }}</span>
                      <span>{{ isRtl ? 'كارب' : 'Carbs' }}</span>
                      <span>{{ isRtl ? 'دهون' : 'Fat' }}</span>
                    </div>
                    <div class="divide-y divide-slate-100">
                      @for (meal of sample.meals; track meal.id) {
                        <div class="grid grid-cols-[1fr_4.5rem_4.5rem_4.5rem_4.5rem] gap-1 py-2 text-[12px]">
                          <span class="min-w-0">
                            <span class="block truncate font-extrabold">{{ mealName(meal) }}</span>
                            <span class="block truncate text-[10px] font-semibold text-slate-500">{{ ingredients(meal) }}</span>
                          </span>
                          <span>{{ meal.calories }}</span>
                          <span>{{ meal.protein }}g</span>
                          <span>{{ meal.carbs }}g</span>
                          <span>{{ meal.fat }}g</span>
                        </div>
                      }
                    </div>
                  </div>
                }
                @case ('nutrition-block') {
                  <div class="grid h-full grid-cols-4 gap-1 text-center">
                    @for (item of nutritionItems(); track item.label) {
                      <div class="flex min-w-0 flex-col justify-center rounded-md bg-white/70 px-1">
                        <span class="truncate text-[10px] font-bold text-slate-500">{{ item.label }}</span>
                        <span class="truncate text-sm font-extrabold text-slate-950">{{ item.value }}</span>
                      </div>
                    }
                  </div>
                }
                @case ('allergy-notes') {
                  <div class="flex h-full flex-col justify-center">
                    <p class="text-[10px] font-extrabold uppercase opacity-70">{{ isRtl ? 'الحساسية' : 'Allergies' }}</p>
                    <p class="mt-1 line-clamp-2 text-sm font-extrabold">{{ allergies() }}</p>
                    <p class="mt-1 line-clamp-2 text-[11px] font-semibold opacity-80">{{ prepNotes() }}</p>
                  </div>
                }
                @case ('totals') {
                  <dl class="grid h-full content-center gap-1 text-xs">
                    <div class="flex justify-between gap-2">
                      <dt>{{ isRtl ? 'عدد الوجبات' : 'Meals' }}</dt>
                      <dd class="font-extrabold">{{ sample.totals.mealsCount }}</dd>
                    </div>
                    <div class="flex justify-between gap-2">
                      <dt>{{ isRtl ? 'إجمالي المطعم' : 'Subtotal' }}</dt>
                      <dd class="font-extrabold">{{ sample.totals.subtotalKd.toFixed(2) }} KD</dd>
                    </div>
                    <div class="flex justify-between gap-2">
                      <dt>{{ isRtl ? 'عمولة المنصة' : 'Platform fee' }}</dt>
                      <dd class="font-extrabold">{{ sample.totals.platformFeeKd.toFixed(2) }} KD</dd>
                    </div>
                    <div class="flex justify-between gap-2 border-t border-current/20 pt-1">
                      <dt>{{ isRtl ? 'مستحق المطعم' : 'Payable' }}</dt>
                      <dd class="font-extrabold">{{ sample.totals.payableKd.toFixed(2) }} KD</dd>
                    </div>
                  </dl>
                }
                @case ('meal-details') {
                  <div class="flex h-full flex-col justify-center">
                    <p class="line-clamp-1 text-sm font-extrabold">{{ mealName(activeMeal()) }}</p>
                    <p class="mt-1 line-clamp-2 text-[11px] font-semibold text-slate-600">{{ ingredients(activeMeal()) }}</p>
                    <p class="mt-1 line-clamp-2 text-[11px] font-semibold text-slate-500">{{ prepNotes() }}</p>
                  </div>
                }
                @default {
                  <div class="flex h-full flex-col justify-center whitespace-pre-line">
                    @if (secondaryText(element)) {
                      <p class="text-[11px] font-bold uppercase text-slate-400">{{ primaryLabel(element) }}</p>
                      <p class="truncate">{{ primaryText(element) }}</p>
                      <p class="truncate text-[11px] font-semibold opacity-70">{{ secondaryText(element) }}</p>
                    } @else {
                      <p class="text-[11px] font-bold uppercase text-slate-400">{{ primaryLabel(element) }}</p>
                      <p class="truncate">{{ primaryText(element) }}</p>
                    }
                  </div>
                }
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  host: { class: 'block' },
})
export class DocumentTemplatePreviewComponent {
  @Input({ required: true }) template!: DocumentTemplate;
  @Input({ required: true }) sample!: InvoiceOrderSnapshot;
  @Input() mealIndex = 0;
  @Input() editable = false;
  @Input() selectedElementId: string | null = null;
  @Input() isRtl = true;

  readonly selected = output<string | null>();
  readonly moved = output<{ id: string; dx: number; dy: number }>();

  visibleElements(): TemplateElement[] {
    return [...this.template.elements]
      .filter((element) => element.visible)
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  canvasStyle(): Record<string, string | number> {
    return {
      width: `${this.template.widthPx}px`,
      height: `${this.template.heightPx}px`,
      background: this.template.backgroundColor,
      borderRadius: '8px',
      '--mm-template-accent': this.template.accentColor,
    };
  }

  elementStyle(element: TemplateElement): Record<string, string | number> {
    return {
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      zIndex: element.zIndex,
      color: element.style.color,
      background: element.style.backgroundColor,
      borderColor: element.style.borderColor,
      borderRadius: `${element.style.radius}px`,
      padding: `${element.style.padding}px`,
      fontSize: `${element.style.fontSize}px`,
      fontWeight: element.style.fontWeight,
      textAlign: this.cssAlign(element),
    };
  }

  elementClass(element: TemplateElement): Record<string, boolean> {
    return {
      'cursor-move': this.editable && !element.locked,
      'cursor-default': !this.editable || element.locked,
      'ring-2 ring-emerald-400 ring-offset-2': this.editable && this.selectedElementId === element.id,
      'border-dashed border-slate-300': this.editable && this.selectedElementId !== element.id,
      'border-transparent': !this.editable,
      'opacity-70': element.locked,
    };
  }

  onSelect(event: MouseEvent, id: string): void {
    if (!this.editable) return;
    event.stopPropagation();
    this.selected.emit(id);
  }

  onDragEnded(event: CdkDragEnd, element: TemplateElement): void {
    if (!this.editable || element.locked) return;
    this.moved.emit({ id: element.id, dx: event.distance.x, dy: event.distance.y });
    event.source.reset();
  }

  activeMeal(): MealLabelSnapshot {
    return this.sample.meals[this.mealIndex] ?? this.sample.meals[0];
  }

  restaurantName(): string {
    return this.isRtl ? this.sample.restaurantNameAr : this.sample.restaurantNameEn;
  }

  mealName(meal: MealLabelSnapshot): string {
    if (this.template.language === 'ar') return meal.mealNameAr;
    if (this.template.language === 'en') return meal.mealNameEn;
    return this.isRtl ? `${meal.mealNameAr} / ${meal.mealNameEn}` : `${meal.mealNameEn} / ${meal.mealNameAr}`;
  }

  ingredients(meal: MealLabelSnapshot): string {
    if (this.template.language === 'ar') return meal.ingredientsAr;
    if (this.template.language === 'en') return meal.ingredientsEn;
    return this.isRtl ? `${meal.ingredientsAr} / ${meal.ingredientsEn}` : `${meal.ingredientsEn} / ${meal.ingredientsAr}`;
  }

  allergies(): string {
    const meal = this.activeMeal();
    if (this.template.language === 'ar') return meal.allergensAr;
    if (this.template.language === 'en') return meal.allergensEn;
    return this.isRtl ? `${meal.allergensAr} / ${meal.allergensEn}` : `${meal.allergensEn} / ${meal.allergensAr}`;
  }

  prepNotes(): string {
    const meal = this.activeMeal();
    if (this.template.language === 'ar') return meal.prepNotesAr;
    if (this.template.language === 'en') return meal.prepNotesEn;
    return this.isRtl ? `${meal.prepNotesAr} / ${meal.prepNotesEn}` : `${meal.prepNotesEn} / ${meal.prepNotesAr}`;
  }

  nutritionItems(): Array<{ label: string; value: string }> {
    const meal = this.activeMeal();
    return [
      { label: this.isRtl ? 'سعرات' : 'Kcal', value: `${meal.calories}` },
      { label: this.isRtl ? 'بروتين' : 'Protein', value: `${meal.protein}g` },
      { label: this.isRtl ? 'كارب' : 'Carbs', value: `${meal.carbs}g` },
      { label: this.isRtl ? 'دهون' : 'Fat', value: `${meal.fat}g` },
    ];
  }

  primaryLabel(element: TemplateElement): string {
    return this.isRtl ? element.labelAr : element.labelEn;
  }

  primaryText(element: TemplateElement): string {
    const lang = this.template.language === 'en' ? 'en' : this.isRtl ? 'ar' : 'en';
    return this.sourceText(element, lang);
  }

  secondaryText(element: TemplateElement): string {
    if (this.template.language !== 'both' && element.kind !== 'bilingual-text') return '';
    const secondaryLang = this.isRtl ? 'en' : 'ar';
    const secondary = this.sourceText(element, secondaryLang);
    return secondary === this.primaryText(element) ? '' : secondary;
  }

  solidBackground(element: TemplateElement): string {
    return element.style.backgroundColor === 'transparent' ? '#ffffff' : element.style.backgroundColor;
  }

  private sourceText(element: TemplateElement, lang: 'ar' | 'en'): string {
    const meal = this.activeMeal();
    switch (element.source) {
      case 'order-id':
        return `${lang === 'ar' ? 'رقم الطلب' : 'Order ID'}: ${this.sample.orderId}`;
      case 'restaurant':
        return `${lang === 'ar' ? 'المطعم' : 'Restaurant'}: ${lang === 'ar' ? this.sample.restaurantNameAr : this.sample.restaurantNameEn}`;
      case 'delivery-date':
        return `${lang === 'ar' ? 'التوصيل' : 'Delivery'}: ${this.sample.deliveryDate} (${this.sample.deliveryWindow})`;
      case 'meal-name':
        return lang === 'ar' ? meal.mealNameAr : meal.mealNameEn;
      case 'allergies':
        return lang === 'ar' ? meal.allergensAr : meal.allergensEn;
      case 'status':
        return lang === 'ar' ? this.sample.orderStatusAr : this.sample.orderStatusEn;
      case 'print-batch':
        return `${this.sample.printBatch} - ${lang === 'ar' ? this.sample.subscriptionDayAr : this.sample.subscriptionDayEn}`;
      case 'barcode':
        return this.sample.barcodeText;
      case 'static':
      default:
        return lang === 'ar' ? element.textAr : element.textEn;
    }
  }

  private cssAlign(element: TemplateElement): 'start' | 'center' | 'end' {
    return element.style.align;
  }
}
