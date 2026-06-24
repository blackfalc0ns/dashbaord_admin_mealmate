import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX, lucideChevronLeft, lucideChevronRight, lucideCheck, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { CampaignCommissionOption } from '../../models';
import { discountSplitError } from '../../utils/collaborative-campaign.util';

@Component({
  selector: 'mm-campaign-form-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ lucideX, lucideChevronLeft, lucideChevronRight, lucideCheck, lucidePlus, lucideTrash2 })],
  templateUrl: './campaign-form-wizard.component.html',
})
export class CampaignFormWizardComponent {
  readonly open = input(false);
  readonly closed = output<void>();
  readonly created = output<string>();

  private readonly fb = inject(FormBuilder);
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly step = signal(0);
  readonly submitting = signal(false);
  readonly splitInvalid = signal(false);

  readonly systemBundles = this.store.systemBundles;

  readonly basicsForm = this.fb.nonNullable.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    descriptionAr: [''],
    descriptionEn: [''],
    totalDiscountPercent: [30, [Validators.required, Validators.min(1), Validators.max(50)]],
    restaurantSharePercent: [20, [Validators.required, Validators.min(0), Validators.max(50)]],
    platformSharePercent: [10, [Validators.required, Validators.min(0), Validators.max(50)]],
    commissionOption: ['half' as CampaignCommissionOption, Validators.required],
    startAtUtc: ['', Validators.required],
    endAtUtc: ['', Validators.required],
    maxSubscribers: [500, [Validators.required, Validators.min(1)]],
  });

  readonly programsForm = this.fb.group({
    programs: this.fb.array([this.createProgramGroup()]),
  });

  readonly reviewForm = this.fb.nonNullable.group({
    sendToRestaurants: [false],
  });

  get programs(): FormArray {
    return this.programsForm.get('programs') as FormArray;
  }

  bundlesAt(programIndex: number): FormArray {
    return this.programs.at(programIndex).get('bundles') as FormArray;
  }

  createProgramGroup() {
    return this.fb.nonNullable.group({
      nameAr: ['عروض العيد', Validators.required],
      nameEn: ['Holiday Offers', Validators.required],
      bundles: this.fb.array([this.createBundleGroup()]),
    });
  }

  createBundleGroup() {
    return this.fb.nonNullable.group({
      nameAr: ['الباقة الذهبية', Validators.required],
      nameEn: ['Golden Bundle', Validators.required],
      linkedBundleId: ['bundle-fitness-2', Validators.required],
    });
  }

  addProgram(): void {
    this.programs.push(this.createProgramGroup());
  }

  addBundle(programIndex: number): void {
    this.bundlesAt(programIndex).push(this.createBundleGroup());
  }

  removeBundle(programIndex: number, bundleIndex: number): void {
    if (this.bundlesAt(programIndex).length <= 1) return;
    this.bundlesAt(programIndex).removeAt(bundleIndex);
  }

  bundleLabel(id: string): string {
    const b = this.systemBundles.find((x) => x.id === id);
    if (!b) return id;
    return this.locale.isRtl() ? `${b.programAr} – ${b.labelAr}` : `${b.programEn} – ${b.labelEn}`;
  }

  close(): void {
    this.step.set(0);
    this.splitInvalid.set(false);
    this.basicsForm.reset({
      totalDiscountPercent: 30,
      restaurantSharePercent: 20,
      platformSharePercent: 10,
      commissionOption: 'half',
      maxSubscribers: 500,
    });
    this.programsForm.setControl('programs', this.fb.array([this.createProgramGroup()]));
    this.reviewForm.reset({ sendToRestaurants: false });
    this.closed.emit();
  }

  nextStep(): void {
    if (this.step() === 0) {
      if (this.basicsForm.invalid) {
        this.basicsForm.markAllAsTouched();
        return;
      }
      const v = this.basicsForm.getRawValue();
      this.splitInvalid.set(discountSplitError(v));
      if (this.splitInvalid()) return;
    }
    if (this.step() === 1 && this.programsForm.invalid) {
      this.programsForm.markAllAsTouched();
      return;
    }
    this.step.update((s) => Math.min(s + 1, 2));
  }

  prevStep(): void {
    this.step.update((s) => Math.max(s - 1, 0));
  }

  submit(asDraft: boolean): void {
    if (this.basicsForm.invalid || this.programsForm.invalid) return;
    const basics = this.basicsForm.getRawValue();
    if (discountSplitError(basics)) {
      this.splitInvalid.set(true);
      return;
    }
    this.submitting.set(true);
    const review = this.reviewForm.getRawValue();
    const programs = this.programs.getRawValue();

    const campaign = this.store.createCampaign({
      ...basics,
      descriptionAr: basics.descriptionAr || undefined,
      descriptionEn: basics.descriptionEn || undefined,
      startAtUtc: new Date(basics.startAtUtc).toISOString(),
      endAtUtc: new Date(basics.endAtUtc).toISOString(),
      programs,
      sendToRestaurants: !asDraft && review.sendToRestaurants,
    });

    this.submitting.set(false);
    this.created.emit(campaign.id);
    this.close();
  }
}
