import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX, lucidePencil, lucideTrash2, lucideSave } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { SUBSCRIPTIONS_I18N } from '@/core/i18n/translations/subscriptions.i18n';
import { SubscriptionsStateService } from '../../data/subscriptions-state.service';
import {
  BundleComponents,
  CatalogStatus,
  MealBundle,
  NutritionProgram,
  SubscriptionDuration,
} from '../../models';

export type CatalogEntityType = 'duration' | 'program' | 'bundle';
export type CatalogDrawerMode = 'view' | 'edit' | 'create';

@Component({
  selector: 'mm-catalog-item-drawer',
  standalone: true,
  imports: [FormsModule, DecimalPipe, NgIcon],
  providers: [provideIcons({ lucideX, lucidePencil, lucideTrash2, lucideSave })],
  templateUrl: './catalog-item-drawer.component.html',
})
export class CatalogItemDrawerComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(SubscriptionsStateService);

  readonly entityType = input.required<CatalogEntityType>();
  readonly mode = input.required<CatalogDrawerMode>();
  readonly itemId = input<string | null>(null);

  readonly closed = output<void>();
  readonly saved = output<string>();
  readonly deleted = output<string>();
  readonly message = output<string>();

  readonly copy = computed(() => SUBSCRIPTIONS_I18N[this.locale.locale()]);
  readonly confirmDelete = signal(false);

  readonly formNameAr = signal('');
  readonly formNameEn = signal('');
  readonly formDescAr = signal('');
  readonly formDescEn = signal('');
  readonly formStatus = signal<CatalogStatus | 'active' | 'inactive'>('active');
  readonly formDays = signal(10);
  readonly formComponents = signal<BundleComponents>({
    breakfast: false,
    mainMeals: 1,
    snack: false,
    salad: true,
  });
  readonly formIsCustom = signal(false);

  readonly program = computed(() => {
    const id = this.itemId();
    return id ? this.state.programs().find((p) => p.id === id) ?? null : null;
  });

  readonly bundle = computed(() => {
    const id = this.itemId();
    return id ? this.state.bundles().find((b) => b.id === id) ?? null : null;
  });

  readonly duration = computed(() => {
    const id = this.itemId();
    return id ? this.state.durations().find((d) => d.id === id) ?? null : null;
  });

  constructor() {
    effect(() => {
      const mode = this.mode();
      if (mode === 'create') {
        this.resetFormForCreate();
        return;
      }
      const type = this.entityType();
      if (type === 'program' && this.program()) this.patchFromProgram(this.program()!);
      if (type === 'bundle' && this.bundle()) this.patchFromBundle(this.bundle()!);
      if (type === 'duration' && this.duration()) this.patchFromDuration(this.duration()!);
      this.confirmDelete.set(false);
    });
  }

  title(): string {
    const c = this.copy();
    const type = this.entityType();
    const mode = this.mode();
    if (mode === 'create') {
      if (type === 'program') return c.addProgram;
      if (type === 'bundle') return c.addBundle;
      return c.addDuration;
    }
    if (mode === 'edit') {
      if (type === 'program') return c.editProgram;
      if (type === 'bundle') return c.editBundle;
      return c.editDuration;
    }
    if (type === 'program') return c.programDetail;
    if (type === 'bundle') return c.colBundle;
    return c.tabDurations;
  }

  displayName(item: { nameAr: string; nameEn: string }): string {
    return this.locale.isRtl() ? item.nameAr : item.nameEn;
  }

  formatDate(iso: string): string {
    return new Intl.DateTimeFormat(this.locale.locale() === 'ar' ? 'ar-KW' : 'en-KW', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kuwait',
    }).format(new Date(iso));
  }

  statusLabel(status: string): string {
    const c = this.copy();
    if (status === 'active') return c.active;
    if (status === 'hidden_for_new') return c.hiddenForNew;
    return c.inactive;
  }

  bundleComponentsLabel(c: BundleComponents): string {
    const copy = this.copy();
    const parts: string[] = [];
    if (c.breakfast) parts.push(copy.componentBreakfast);
    if (c.mainMeals) parts.push(`${c.mainMeals} ${copy.componentMain}`);
    if (c.snack) parts.push(copy.componentSnack);
    if (c.salad) parts.push(copy.componentSalad);
    return parts.join(' · ');
  }

  switchToEdit(): void {
    this.editRequested.emit();
  }

  readonly editRequested = output<void>();

  canDelete(): boolean {
    const type = this.entityType();
    if (type === 'duration') {
      const d = this.duration();
      return !!d?.isCustom;
    }
    return true;
  }

  setMainMeals(count: number): void {
    this.formComponents.update((c) => ({ ...c, mainMeals: count }));
  }

  setComponentFlag(key: 'breakfast' | 'snack' | 'salad', value: boolean): void {
    this.formComponents.update((c) => ({ ...c, [key]: value }));
  }

  save(): void {
    const type = this.entityType();
    const mode = this.mode();
    const c = this.copy();

    if (type === 'program') {
      if (mode === 'create') {
        this.state.addProgram({
          nameAr: this.formNameAr(),
          nameEn: this.formNameEn(),
          descriptionAr: this.formDescAr(),
          descriptionEn: this.formDescEn(),
          status: this.formStatus() as CatalogStatus,
        });
        this.saved.emit(c.saved);
        return;
      }
      const id = this.itemId();
      if (!id) return;
      this.state.updateProgram(id, {
        nameAr: this.formNameAr(),
        nameEn: this.formNameEn(),
        descriptionAr: this.formDescAr(),
        descriptionEn: this.formDescEn(),
        status: this.formStatus() as CatalogStatus,
      });
      this.saved.emit(c.saved);
      return;
    }

    if (type === 'bundle') {
      if (mode === 'create') {
        this.state.addBundle({
          nameAr: this.formNameAr(),
          nameEn: this.formNameEn(),
          components: this.formComponents(),
          isCustom: this.formIsCustom(),
          status: this.formStatus() as CatalogStatus,
        });
        this.saved.emit(c.saved);
        return;
      }
      const id = this.itemId();
      if (!id) return;
      this.state.updateBundle(id, {
        nameAr: this.formNameAr(),
        nameEn: this.formNameEn(),
        components: this.formComponents(),
        isCustom: this.formIsCustom(),
        status: this.formStatus() as CatalogStatus,
      });
      this.saved.emit(c.saved);
      return;
    }

    if (type === 'duration') {
      if (mode === 'create') {
        this.state.addDuration({
          nameAr: this.formNameAr(),
          nameEn: this.formNameEn(),
          days: this.formDays(),
          status: this.formStatus() as 'active' | 'inactive',
          isCustom: true,
        });
        this.saved.emit(c.saved);
        return;
      }
      const id = this.itemId();
      if (!id) return;
      this.state.updateDuration(id, {
        nameAr: this.formNameAr(),
        nameEn: this.formNameEn(),
        days: this.duration()?.isCustom ? this.formDays() : this.duration()!.days,
        status: this.formStatus() as 'active' | 'inactive',
      });
      this.saved.emit(c.saved);
    }
  }

  requestDelete(): void {
    this.confirmDelete.set(true);
  }

  confirmDeleteAction(): void {
    const c = this.copy();
    const id = this.itemId();
    if (!id) return;
    const type = this.entityType();

    if (type === 'duration') {
      const result = this.state.removeDuration(id);
      this.message.emit(result === 'blocked' ? c.cannotDeletePreset : c.deletedMsg);
      this.deleted.emit(result);
      return;
    }
    if (type === 'program') {
      const result = this.state.removeProgram(id);
      this.message.emit(result === 'hidden' ? c.hideInsteadMsg : c.deletedMsg);
      this.deleted.emit(result);
      return;
    }
    const result = this.state.removeBundle(id);
    this.message.emit(result === 'hidden' ? c.hideInsteadMsg : c.deletedMsg);
    this.deleted.emit(result);
  }

  private resetFormForCreate(): void {
    this.formNameAr.set('');
    this.formNameEn.set('');
    this.formDescAr.set('');
    this.formDescEn.set('');
    this.formStatus.set('active');
    this.formDays.set(10);
    this.formIsCustom.set(this.entityType() === 'bundle');
    this.formComponents.set({ breakfast: false, mainMeals: 1, snack: false, salad: true });
  }

  private patchFromProgram(p: NutritionProgram): void {
    this.formNameAr.set(p.nameAr);
    this.formNameEn.set(p.nameEn);
    this.formDescAr.set(p.descriptionAr);
    this.formDescEn.set(p.descriptionEn);
    this.formStatus.set(p.status);
  }

  private patchFromBundle(b: MealBundle): void {
    this.formNameAr.set(b.nameAr);
    this.formNameEn.set(b.nameEn);
    this.formComponents.set({ ...b.components });
    this.formIsCustom.set(b.isCustom);
    this.formStatus.set(b.status);
  }

  private patchFromDuration(d: SubscriptionDuration): void {
    this.formNameAr.set(d.nameAr);
    this.formNameEn.set(d.nameEn);
    this.formDays.set(d.days);
    this.formStatus.set(d.status);
  }
}
