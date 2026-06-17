import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminPageContextService } from '../../navigation/admin-page-context.service';
import { AdminShellLayoutService } from '../admin-shell-layout.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { AdminPageToolbarComponent } from '../admin-page-toolbar/admin-page-toolbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'mm-admin-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminPageToolbarComponent,
  ],
  providers: [AdminShellLayoutService],
  templateUrl: './admin-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-dvh',
  },
})
export class AdminShellComponent {
  protected readonly layout = inject(AdminShellLayoutService);
  private readonly pageContext = inject(AdminPageContextService);

  readonly hidePageToolbar = computed(() => {
    const pageId = this.pageContext.context().page?.id;
    return pageId === 'overview' || pageId === 'security-workspace';
  });

  closeMobileNav(): void {
    this.layout.closeMobileNav();
  }
}
