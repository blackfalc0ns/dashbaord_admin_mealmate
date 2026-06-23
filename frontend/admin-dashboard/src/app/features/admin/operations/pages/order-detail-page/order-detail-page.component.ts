import { Component, inject, computed, signal, OnInit, DestroyRef, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { ACCOUNTS_DETAIL_ICONS, MmDetailToastComponent } from '@/shared/components/accounts';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';
import { OperationsStateService } from '../../data/operations-state.service';
import { OrderDetailBodyComponent } from '../../components/orders/order-detail-body/order-detail-body.component';
import { OrderActionDrawerComponent } from '../../components/orders/order-action-drawer/order-action-drawer.component';
import { OrderActionType } from '../../components/orders/order-queue-table/order-queue-table.component';

@Component({
  selector: 'mm-order-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    MmDetailToastComponent,
    OrderDetailBodyComponent,
    OrderActionDrawerComponent,
  ],
  templateUrl: './order-detail-page.component.html',
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
  host: { class: 'block' },
})
export class OrderDetailPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStateService);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);

  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly orderId = signal<string | null>(null);
  readonly drawerAction = signal<OrderActionType | null>(null);
  readonly toastMessage = signal<string | null>(null);

  readonly order = computed(() => {
    const id = this.orderId();
    return id ? this.state.getOrder(id) : null;
  });

  readonly timeline = computed(() => {
    const o = this.order();
    return o ? this.state.buildTimeline(o) : [];
  });

  readonly exceptions = computed(() => {
    const id = this.orderId();
    return id ? this.state.getOrderExceptions(id) : [];
  });

  constructor() {
    effect(() => {
      const o = this.order();
      if (!o) return;
      this.pageContext.customTitle.set(o.customerDisplayName);
      this.pageContext.customDescription.set(`${this.copy().orderId} ${o.orderId}`);
      this.pageContext.customBreadcrumbs.set([
        { label: this.locale.isRtl() ? 'العمليات' : 'Operations' },
        { label: this.locale.isRtl() ? 'الطلبات' : 'Orders', route: '/admin/operations/orders' },
        { label: o.customerDisplayName, active: true },
      ]);
    });

    this.destroyRef.onDestroy(() => {
      this.pageContext.customTitle.set(null);
      this.pageContext.customDescription.set(null);
      this.pageContext.customBreadcrumbs.set(null);
    });
  }

  ngOnInit(): void {
    this.orderId.set(this.route.snapshot.paramMap.get('id'));
  }

  openAction(action: OrderActionType): void {
    this.drawerAction.set(action);
  }

  closeDrawer(): void {
    this.drawerAction.set(null);
  }

  onCompleted(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
