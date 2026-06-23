import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { AdminAuthStore } from '@/core/auth/admin-auth.store';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { Order72hStore } from '../../data/order-72h-store';
import { OrderExceptionType } from '../../models';

@Component({
  selector: 'mm-exception-form',
  standalone: true,
  imports: [ReactiveFormsModule, HasPermissionDirective],
  templateUrl: './exception-form.component.html',
})
export class ExceptionFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AdminAuthStore);
  readonly locale = inject(AppLocaleService);
  readonly store = inject(Order72hStore);
  readonly perms = AdminPermissions;

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
    if (!this.auth.canAccess(AdminPermissions.order72hException)) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.store.exceptionLogs.update((logs) => [
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
