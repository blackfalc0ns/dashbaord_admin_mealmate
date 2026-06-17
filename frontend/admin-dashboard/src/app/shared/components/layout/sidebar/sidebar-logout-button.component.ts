import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut } from '@ng-icons/lucide';

@Component({
  selector: 'mm-sidebar-logout-button',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './sidebar-logout-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideLogOut })],
})
export class MmSidebarLogoutButtonComponent {
  readonly label = input.required<string>();
  readonly hint = input.required<string>();
  readonly collapsed = input(false);
  readonly showDetails = input(true);

  readonly logout = output<void>();

  protected readonly isCompact = computed(() => this.collapsed() || !this.showDetails());
}
