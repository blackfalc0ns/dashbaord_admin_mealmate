import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { Order72hStateService } from '../../data/order-72h-state.service';
import { OrderExceptionType } from '../../models';

@Component({
  selector: 'mm-exception-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './exception-form.component.html',
})
export class ExceptionFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly locale = inject(AppLocaleService);
  readonly state = inject(Order72hStateService);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    orderId: ['', Validators.required],
    exceptionType: [OrderExceptionType.ChangeBox, Validators.required],
    reason: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly exceptionTypes = computed(() => [
    { value: OrderExceptionType.ChangeBox, label: this.copy().changeBox },
    { value: OrderExceptionType.ChangeRestaurant, label: this.copy().changeRestaurant },
    { value: OrderExceptionType.CancelDay, label: this.copy().cancelDay },
  ]);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.state.exceptionLogs.update((logs) => [
      {
        id: `EXC-${Date.now()}`,
        orderId: v.orderId,
        customerDisplayName: '—',
        restaurantName: '—',
        deliveryDate: new Date().toISOString().slice(0, 10),
        exceptionType: v.exceptionType,
        reason: v.reason,
        actorName: 'Admin — Current User',
        appliedAt: new Date().toISOString(),
      },
      ...logs,
    ]);

    this.submitted.set(true);
    this.form.reset({
      orderId: '',
      exceptionType: OrderExceptionType.ChangeBox,
      reason: '',
    });
    setTimeout(() => this.submitted.set(false), 3000);
  }
}
