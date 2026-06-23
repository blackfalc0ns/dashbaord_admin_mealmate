import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AdminAuthStore } from '@/core/auth/admin-auth.store';
import { AdminPermission } from '@/core/auth/admin-permissions';

/** Structural directive — renders template when user has required permission(s). */
@Directive({
  selector: '[mmHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly auth = inject(AdminAuthStore);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private visible = false;

  @Input({ alias: 'mmHasPermission', required: true })
  set permission(value: AdminPermission | AdminPermission[]) {
    const required = Array.isArray(value) ? value : [value];
    const allowed = this.auth.canAccessAll(...required);
    this.updateView(allowed);
  }

  private updateView(show: boolean): void {
    if (show && !this.visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.visible = true;
    } else if (!show && this.visible) {
      this.viewContainer.clear();
      this.visible = false;
    }
  }
}
