import { Component, Input, inject, computed, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderExceptionType } from '../../../models';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { OperationsStateService } from '../../../data/operations-state.service';
import { OrderActionType } from '../order-queue-table/order-queue-table.component';

@Component({
  selector: 'mm-order-action-drawer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-action-drawer.component.html',
})
export class OrderActionDrawerComponent {
  private readonly fb = inject(FormBuilder);
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStateService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);

  @Input() orderId: string | null = null;
  @Input() action: OrderActionType | null = null;

  readonly closed = output<void>();
  readonly completed = output<string>();

  readonly exceptionForm = this.fb.nonNullable.group({
    exceptionType: [OrderExceptionType.ChangeBox, Validators.required],
    reason: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly reason = signal('');

  title(): string {
    switch (this.action) {
      case 'replacement':
        return this.copy().openReplacement;
      case 'reassign':
        return this.copy().manualReassign;
      case 'exception':
        return this.copy().applyException;
      default:
        return '';
    }
  }

  close(): void {
    this.closed.emit();
  }

  confirm(): void {
    if (!this.orderId || !this.action) return;

    if (this.action === 'replacement') {
      this.state.openReplacementWindow(this.orderId);
      this.completed.emit(this.copy().openReplacement);
      this.close();
      return;
    }

    if (this.action === 'reassign') {
      this.state.manualReassign(this.orderId, 'RST-002', 'Green Kitchen');
      this.completed.emit(this.copy().manualReassign);
      this.close();
      return;
    }

    if (this.action === 'exception') {
      if (this.exceptionForm.invalid) {
        this.exceptionForm.markAllAsTouched();
        return;
      }
      const v = this.exceptionForm.getRawValue();
      this.state.applyException(this.orderId, v.exceptionType, v.reason);
      this.completed.emit(this.copy().submitException);
      this.exceptionForm.reset({
        exceptionType: OrderExceptionType.ChangeBox,
        reason: '',
      });
      this.close();
    }
  }

  exceptionTypes() {
    return [
      { value: OrderExceptionType.ChangeBox, label: this.copy().changeBox },
      { value: OrderExceptionType.ChangeRestaurant, label: this.copy().changeRestaurant },
      { value: OrderExceptionType.CancelDay, label: this.copy().cancelDay },
    ];
  }
}
