import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';

@Component({
  selector: 'mm-campaign-modal-shell',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ lucideX })],
  templateUrl: './campaign-modal-shell.component.html',
})
export class CampaignModalShellComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly size = input<'md' | 'lg' | 'xl'>('lg');
  readonly closed = output<void>();

  readonly locale = input.required<AppLocaleService>();

  close(): void {
    this.closed.emit();
  }

  maxWidthClass(): string {
    const s = this.size();
    if (s === 'xl') return 'max-w-3xl';
    if (s === 'md') return 'max-w-md';
    return 'max-w-2xl';
  }
}
