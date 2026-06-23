import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'mm-sla-countdown',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="text-xs font-bold" [ngClass]="toneClass">{{ hoursRemaining }}h</span>
  `,
})
export class MmSlaCountdownComponent {
  @Input({ required: true }) hoursRemaining!: number;

  get toneClass(): string {
    if (this.hoursRemaining <= 6) return 'text-red-600';
    if (this.hoursRemaining <= 12) return 'text-amber-600';
    return 'text-emerald-600';
  }
}
