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
      class="flex h-full w-full flex-col rounded-xl border text-start shadow-sm transition hover:shadow-md"
      [ngClass]="[
        active ? activeClass : 'border-slate-200 bg-white',
        compact ? 'min-h-0 p-2.5' : 'min-h-[6.75rem] p-4',
      ]"
      (click)="clicked.emit()"
    >
      <div class="flex flex-1 items-center justify-between gap-1.5">
        <div class="flex min-w-0 flex-col gap-0.5">
          <span class="font-bold text-slate-500 truncate" [class]="compact ? 'text-[10px]' : 'text-xs'">{{ label }}</span>
          <span class="truncate font-extrabold leading-tight" [ngClass]="valueClass" [class]="compact ? 'text-lg' : 'text-2xl'">{{ value }}</span>
        </div>
        @if (icon) {
          <div
            class="flex shrink-0 items-center justify-center rounded-lg ring-1"
            [ngClass]="iconWrapClass"
            [class]="compact ? 'size-7' : 'size-10'"
          >
            <ng-icon [name]="icon" [size]="compact ? '14' : '20'" />
          </div>
        }
      </div>
      @if (description) {
        <p class="truncate leading-tight text-slate-400" [class]="compact ? 'mt-1 text-[9px]' : 'mt-2 min-h-[14px] text-[10px]'">{{ description }}</p>
      }
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
  @Input() compact = false;

  readonly clicked = output<void>();
}
