import { Component, Input, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { OrderTimelineEvent } from '@/features/admin/operations/models';
import { AppLocaleService } from '@/core/i18n/app-locale.service';

@Component({
  selector: 'mm-audit-timeline',
  standalone: true,
  imports: [NgClass],
  template: `
    <ol class="relative space-y-4 border-s border-slate-200 ps-6">
      @for (event of events; track event.id) {
        <li class="relative">
          <span
            class="absolute -start-[1.65rem] top-1 size-3 rounded-full ring-2 ring-white"
            [ngClass]="dotClass(event.status)"
          ></span>
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-bold text-slate-900">{{ label(event) }}</span>
            <span class="text-xs text-slate-500">{{ event.at ?? '—' }}</span>
          </div>
        </li>
      }
    </ol>
  `,
})
export class MmAuditTimelineComponent {
  private readonly locale = inject(AppLocaleService);

  @Input({ required: true }) events: OrderTimelineEvent[] = [];

  label(event: OrderTimelineEvent): string {
    return this.locale.isRtl() ? event.labelAr : event.labelEn;
  }

  dotClass(status: OrderTimelineEvent['status']): string {
    switch (status) {
      case 'done':
        return 'bg-emerald-500';
      case 'active':
        return 'bg-sky-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-slate-300';
    }
  }
}
