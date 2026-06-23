import { Component, Input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'mm-operations-kpi-card',
  standalone: true,
  imports: [NgClass, NgIcon],
  host: { class: 'block h-full' },
  template: `
    <button
      type="button"
      class="flex h-full min-h-[6.75rem] w-full flex-col rounded-xl border p-4 text-start shadow-sm transition hover:shadow-md"
      [ngClass]="active ? activeClass : 'border-slate-200 bg-white'"
      (click)="clicked.emit()"
    >
      <div class="flex flex-1 items-center justify-between gap-2">
        <div class="flex min-w-0 flex-col gap-1">
          <span class="text-xs font-bold text-slate-500">{{ label }}</span>
          <span class="truncate text-2xl font-extrabold leading-tight" [ngClass]="valueClass">{{ value }}</span>
        </div>
        @if (icon) {
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg ring-1" [ngClass]="iconWrapClass">
            <ng-icon [name]="icon" size="20" />
          </div>
        }
      </div>
      <p class="mt-2 min-h-[14px] truncate text-[10px] leading-tight text-slate-400">{{ description }}</p>
    </button>
  `,
})
export class MmOperationsKpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number | string;
  @Input() description = '';
  @Input() icon = '';
  @Input() active = false;
  @Input() valueClass = 'text-slate-900';
  @Input() iconWrapClass = 'bg-slate-50 text-slate-600 ring-slate-100';
  @Input() activeClass = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100';

  readonly clicked = output<void>();
}
