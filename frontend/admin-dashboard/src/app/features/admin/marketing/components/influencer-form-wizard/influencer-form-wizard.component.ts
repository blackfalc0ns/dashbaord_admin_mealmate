import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX, lucideChevronLeft, lucideChevronRight, lucideCheck } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { CreateInfluencerPayload } from '../../models';

@Component({
  selector: 'mm-influencer-form-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ lucideX, lucideChevronLeft, lucideChevronRight, lucideCheck })],
  templateUrl: './influencer-form-wizard.component.html',
})
export class InfluencerFormWizardComponent {
  readonly open = input(false);
  readonly closed = output<void>();
  readonly created = output<string>();

  private readonly fb = inject(FormBuilder);
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly step = signal(0);
  readonly submitting = signal(false);

  readonly identityForm = this.fb.nonNullable.group({
    displayNameAr: ['', Validators.required],
    displayNameEn: ['', Validators.required],
    contactPhone: [''],
    contactEmail: ['', Validators.email],
    userId: [''],
    socialPlatform: ['Instagram'],
    socialHandle: [''],
  });

  readonly promotionForm = this.fb.nonNullable.group({
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    code: ['', [Validators.required, Validators.minLength(4)]],
  });

  readonly commissionForm = this.fb.nonNullable.group({
    defaultCommissionRate: [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    activateNow: [true],
  });

  close(): void {
    this.step.set(0);
    this.closed.emit();
  }

  nextStep(): void {
    if (this.step() === 0 && this.identityForm.invalid) {
      this.identityForm.markAllAsTouched();
      return;
    }
    if (this.step() === 1 && this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }
    this.step.update((s) => Math.min(s + 1, 2));
  }

  prevStep(): void {
    this.step.update((s) => Math.max(s - 1, 0));
  }

  submit(): void {
    if (this.commissionForm.invalid) {
      this.commissionForm.markAllAsTouched();
      return;
    }
    const id = this.identityForm.getRawValue();
    const promo = this.promotionForm.getRawValue();
    const comm = this.commissionForm.getRawValue();

    const payload: CreateInfluencerPayload = {
      displayNameAr: id.displayNameAr,
      displayNameEn: id.displayNameEn,
      contactPhone: id.contactPhone,
      contactEmail: id.contactEmail,
      userId: id.userId || null,
      socialChannels: id.socialHandle
        ? [{ platform: id.socialPlatform, handle: id.socialHandle }]
        : [],
      slug: promo.slug,
      code: promo.code,
      defaultCommissionRate: comm.defaultCommissionRate,
      activateNow: comm.activateNow,
    };

    this.submitting.set(true);
    const created = this.store.createInfluencer(payload);
    this.submitting.set(false);
    this.created.emit(created.id);
    this.close();
  }
}
