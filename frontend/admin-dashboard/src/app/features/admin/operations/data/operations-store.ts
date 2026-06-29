import { Injectable, computed, signal } from '@angular/core';
import {
  AdminOrderDetail,
  AdminOrderRow,
  AutoSelectionAuditEvent,
  AutoSelectionRow,
  AutoSelectionRuleConfig,
  CapacityAuditEvent,
  DeliveryTrackingRow,
  HoldCaseRow,
  MenuApprovalAuditEvent,
  MenuApprovalRequest,
  OrderExceptionLog,
  OrderLifecyclePhase,
  OrderTimelineEvent,
  OrderWorkspaceView,
  ReplacementWindowRow,
  ReplacementWindowStatus,
  RestaurantMenuReadiness,
  RestaurantCapacityRow,
  RestaurantConfirmationStatus,
} from '../models';
import { OrderExceptionType } from '../models/order-lifecycle.enums';
import {
  DEFAULT_ORDER_EXTRAS,
  ORDER_DETAIL_EXTRAS,
} from './order-detail-extras.mock';
import {
  DELIVERY_TRACKING_MOCK,
  HOLD_CASES_MOCK,
  ORDER_EXCEPTION_LOGS_MOCK,
  ORDERS_MOCK,
  PREP_BY_ORDER_ID,
  REPLACEMENT_WINDOW_MOCK,
} from './operations.mock';
import { CAPACITY_AUDIT_MOCK, CAPACITY_ROWS_MOCK } from './capacity.mock';
import {
  AUTO_SELECTION_ALERTS_MOCK,
  AUTO_SELECTION_AUDIT_MOCK,
  AUTO_SELECTION_DISTRIBUTION_MOCK,
  AUTO_SELECTION_ROWS_MOCK,
  AUTO_SELECTION_RULE_CONFIG,
} from './auto-selection.mock';
import {
  MENU_APPROVAL_AUDIT_MOCK,
  MENU_APPROVAL_REQUESTS_MOCK,
  RESTAURANT_MENU_READINESS_MOCK,
} from './menu-approval.mock';

/** Signal store for F120 operations monitoring — orders, delivery, hold, audit. */
@Injectable({ providedIn: 'root' })
export class OperationsStore {
  readonly allOrders = signal<AdminOrderRow[]>([...ORDERS_MOCK]);
  readonly replacementWindows = signal<ReplacementWindowRow[]>([...REPLACEMENT_WINDOW_MOCK]);
  readonly exceptionLogs = signal<OrderExceptionLog[]>([...ORDER_EXCEPTION_LOGS_MOCK]);
  readonly trackingRows = signal<DeliveryTrackingRow[]>([...DELIVERY_TRACKING_MOCK]);
  readonly holdCases = signal<HoldCaseRow[]>([...HOLD_CASES_MOCK]);
  readonly capacityRows = signal<RestaurantCapacityRow[]>([...CAPACITY_ROWS_MOCK]);
  readonly capacityAudit = signal<CapacityAuditEvent[]>([...CAPACITY_AUDIT_MOCK]);
  readonly autoSelectionRows = signal<AutoSelectionRow[]>([...AUTO_SELECTION_ROWS_MOCK]);
  readonly autoSelectionAudit = signal<AutoSelectionAuditEvent[]>([...AUTO_SELECTION_AUDIT_MOCK]);
  readonly autoSelectionRule = signal<AutoSelectionRuleConfig>({ ...AUTO_SELECTION_RULE_CONFIG });
  readonly autoSelectionDistribution = signal([...AUTO_SELECTION_DISTRIBUTION_MOCK]);
  readonly autoSelectionAlerts = signal([...AUTO_SELECTION_ALERTS_MOCK]);
  readonly menuApprovalRequests = signal<MenuApprovalRequest[]>([...MENU_APPROVAL_REQUESTS_MOCK]);
  readonly menuApprovalAudit = signal<MenuApprovalAuditEvent[]>([...MENU_APPROVAL_AUDIT_MOCK]);
  readonly menuReadinessRows = signal<RestaurantMenuReadiness[]>([
    ...RESTAURANT_MENU_READINESS_MOCK,
  ]);

  readonly needsActionCount = computed(() => this.filterByView('needs-action').length);
  readonly activeHoldCount = computed(
    () => this.holdCases().filter((c) => c.status !== 'resolved').length,
  );
  readonly capacityKpis = computed(() => {
    const rows = this.capacityRows();
    const capacity = rows.reduce((sum, r) => sum + r.capacityLimit, 0);
    const booked = rows.reduce((sum, r) => sum + r.bookedMeals, 0);
    const blocked = rows.reduce((sum, r) => sum + r.blockedMeals, 0);
    const busy = rows.filter((r) => r.status === 'busy_auto' || r.status === 'busy_manual').length;
    const atRisk = rows.filter((r) => r.status === 'at_risk').length;
    const overrides = rows.filter((r) => r.overrideUntil).length;

    return {
      capacity,
      booked,
      blocked,
      utilization: capacity ? Math.round((booked / capacity) * 100) : 0,
      busy,
      atRisk,
      overrides,
    };
  });

  readonly autoSelectionKpis = computed(() => {
    const rows = this.autoSelectionRows();
    const completed = rows.filter((r) => r.status === 'completed').length;
    const pending = rows.filter((r) => r.status === 'pending').length;
    const fallback = rows.filter((r) => r.status === 'fallback').length;
    const quotaOverride = rows.filter((r) => r.status === 'quota_override').length;
    const failed = rows.filter((r) => r.status === 'failed').length;
    const resolved = completed + fallback + quotaOverride;
    const successRate = resolved ? Math.round((completed / resolved) * 100) : 0;

    return {
      total: rows.length,
      completed,
      pending,
      fallback,
      quotaOverride,
      failed,
      successRate,
    };
  });

  readonly menuApprovalKpis = computed(() => {
    const requests = this.menuApprovalRequests();
    const pending = requests.filter((r) => r.status === 'pending' || r.status === 'in_review').length;
    const translationIssues = requests.filter((r) => r.blockerCodes.includes('missing_translation')).length;
    const nutritionIssues = requests.filter(
      (r) => r.blockerCodes.includes('missing_nutrition') || r.blockerCodes.includes('missing_allergens'),
    ).length;
    const cancellationRequests = requests.filter(
      (r) => r.requestType === 'cancel_meal' && ['pending', 'in_review'].includes(r.status),
    ).length;
    const notReadyRestaurants = this.menuReadinessRows().filter((r) => r.status !== 'ready').length;
    const labelReadyPercent = requests.length
      ? Math.round((requests.filter((r) => r.meal.labelReady).length / requests.length) * 100)
      : 0;

    return {
      pending,
      translationIssues,
      nutritionIssues,
      cancellationRequests,
      notReadyRestaurants,
      labelReadyPercent,
    };
  });

  getOrder(orderId: string): AdminOrderDetail | null {
    const row = this.allOrders().find((o) => o.orderId === orderId);
    if (!row) return null;

    const prep = PREP_BY_ORDER_ID[row.orderId];
    const window = this.replacementWindows().find((w) => w.orderId === orderId);

    return {
      ...row,
      barcodeGenerated: prep?.barcodeGenerated ?? false,
      invoiceGenerated: prep?.invoiceGenerated ?? false,
      driverAssigned: prep?.driverAssigned ?? false,
      driverName: prep?.driverName ?? null,
      replacementHoursRemaining: window?.hoursRemaining ?? null,
      extras: ORDER_DETAIL_EXTRAS[row.orderId] ?? DEFAULT_ORDER_EXTRAS,
    };
  }

  getOrderExceptions(orderId: string): OrderExceptionLog[] {
    return this.exceptionLogs().filter((l) => l.orderId === orderId);
  }

  getTracking(orderId: string): DeliveryTrackingRow | null {
    return this.trackingRows().find((t) => t.orderId === orderId) ?? null;
  }

  getHoldCase(orderId: string): HoldCaseRow | null {
    return (
      this.holdCases().find((c) => c.orderId === orderId && c.status !== 'resolved') ?? null
    );
  }

  buildTimeline(order: AdminOrderDetail): OrderTimelineEvent[] {
    const { extras } = order;
    return [
      {
        id: 'meal',
        labelAr: 'اختيار الوجبة',
        labelEn: 'Meal selected',
        at: extras.dispatchedToRestaurantAt,
        status: 'done',
      },
      {
        id: 'lock72',
        labelAr: 'قفل −72h',
        labelEn: '−72h lock',
        at: extras.lockedAt,
        status: order.isCustomerEditLocked ? 'done' : 'pending',
      },
      {
        id: 'dispatch',
        labelAr: 'إرسال للمطعم',
        labelEn: 'Sent to restaurant',
        at: extras.dispatchedToRestaurantAt,
        status: extras.dispatchedToRestaurantAt ? 'done' : 'pending',
      },
      {
        id: 'confirm',
        labelAr: 'تأكيد المطعم',
        labelEn: 'Restaurant confirm',
        at: order.confirmationDeadlineAt,
        status:
          order.phase === OrderLifecyclePhase.ConfirmationOverdue
            ? 'overdue'
            : order.confirmationStatus === RestaurantConfirmationStatus.Confirmed
              ? 'done'
              : order.isCustomerEditLocked
                ? 'active'
                : 'pending',
      },
      {
        id: 'prep24',
        labelAr: 'تحضير −24h',
        labelEn: '−24h prep',
        at: null,
        status:
          order.phase === OrderLifecyclePhase.PreparingAt24h
            ? 'active'
            : order.hoursUntilDelivery <= 24
              ? 'pending'
              : 'pending',
      },
      {
        id: 'pickup',
        labelAr: 'استلام السائق',
        labelEn: 'Driver pickup',
        at: this.getTracking(order.orderId)?.lastScanAt ?? null,
        status: this.getTracking(order.orderId)?.barcodeScannedPickup ? 'done' : 'pending',
      },
      {
        id: 'deliver',
        labelAr: 'التسليم',
        labelEn: 'Delivery',
        at: null,
        status:
          order.phase === OrderLifecyclePhase.Delivered ||
          this.getTracking(order.orderId)?.status === 'delivered'
            ? 'done'
            : 'pending',
      },
    ];
  }

  filterByView(view: OrderWorkspaceView): AdminOrderRow[] {
    const orders = this.allOrders();
    switch (view) {
      case 'needs-action':
        return orders.filter((o) => this.orderNeedsAction(o));
      case 'confirmation':
        return orders.filter(
          (o) =>
            o.phase === OrderLifecyclePhase.AwaitingRestaurantConfirmation ||
            o.phase === OrderLifecyclePhase.ConfirmationOverdue ||
            o.phase === OrderLifecyclePhase.LockedAt72h,
        );
      case 'replacement':
        return orders.filter(
          (o) => o.phase === OrderLifecyclePhase.ReplacementWindowOpen,
        );
      case 'prep':
        return orders.filter((o) => o.phase === OrderLifecyclePhase.PreparingAt24h);
      default:
        return orders;
    }
  }

  orderNeedsAction(order: AdminOrderRow): boolean {
    if (order.phase === OrderLifecyclePhase.ConfirmationOverdue) return true;

    const window = this.replacementWindows().find((w) => w.orderId === order.orderId);
    if (
      window?.status === ReplacementWindowStatus.Open &&
      window.hoursRemaining <= 6
    ) {
      return true;
    }

    const prep = PREP_BY_ORDER_ID[order.orderId];
    if (
      order.phase === OrderLifecyclePhase.PreparingAt24h &&
      prep &&
      (!prep.barcodeGenerated || !prep.driverAssigned)
    ) {
      return true;
    }

    return false;
  }

  openReplacementWindow(orderId: string): void {
    this.allOrders.update((rows) =>
      rows.map((r) =>
        r.orderId === orderId
          ? {
              ...r,
              phase: OrderLifecyclePhase.ReplacementWindowOpen,
              replacementWindowStatus: ReplacementWindowStatus.Open,
            }
          : r,
      ),
    );

    const row = this.allOrders().find((r) => r.orderId === orderId);
    if (!row) return;

    const now = new Date();
    const closes = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    this.replacementWindows.update((windows) => [
      {
        orderId,
        customerDisplayName: row.customerDisplayName,
        originalRestaurantName: row.restaurantName,
        windowOpensAt: now.toISOString(),
        windowClosesAt: closes.toISOString(),
        status: ReplacementWindowStatus.Open,
        hoursRemaining: 24,
      },
      ...windows.filter((w) => w.orderId !== orderId),
    ]);
  }

  manualReassign(orderId: string, targetRestaurantId: string, targetRestaurantName: string): void {
    this.allOrders.update((rows) =>
      rows.map((r) =>
        r.orderId === orderId
          ? {
              ...r,
              restaurantId: targetRestaurantId,
              restaurantName: targetRestaurantName,
              confirmationStatus: RestaurantConfirmationStatus.Reassigned,
              phase: OrderLifecyclePhase.AwaitingRestaurantConfirmation,
            }
          : r,
      ),
    );
  }

  applyException(
    orderId: string,
    exceptionType: OrderExceptionType,
    reason: string,
  ): void {
    const row = this.allOrders().find((r) => r.orderId === orderId);
    this.exceptionLogs.update((logs) => [
      {
        id: `EXC-${Date.now()}`,
        orderId,
        customerDisplayName: row?.customerDisplayName ?? '—',
        restaurantName: row?.restaurantName ?? '—',
        deliveryDate: row?.deliveryDate ?? new Date().toISOString().slice(0, 10),
        exceptionType,
        reason,
        actorName: 'Admin — Current User',
        appliedAt: new Date().toISOString(),
      },
      ...logs,
    ]);
  }

  resolveHoldCase(caseId: string): void {
    this.holdCases.update((cases) =>
      cases.map((c) =>
        c.caseId === caseId ? { ...c, status: 'resolved' as const } : c,
      ),
    );
  }

  recordContactAttempt(caseId: string): void {
    this.holdCases.update((cases) =>
      cases.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              contactAttempts: c.contactAttempts + 1,
              lastContactAt: new Date().toISOString(),
              status: c.status === 'active' ? ('contact_pending' as const) : c.status,
            }
          : c,
      ),
    );
  }

  markRestaurantBusy(restaurantId: string, reason: string): void {
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    this.capacityRows.update((rows) =>
      rows.map((r) =>
        r.restaurantId === restaurantId
          ? {
              ...r,
              status: 'busy_manual',
              automationReason: reason,
              overrideUntil: until,
              blockedMeals: Math.max(r.blockedMeals, r.capacityLimit - r.bookedMeals),
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    this.appendCapacityAudit(restaurantId, 'Override', reason);
  }

  releaseRestaurantBusy(restaurantId: string): void {
    const row = this.capacityRows().find((r) => r.restaurantId === restaurantId);
    if (!row) return;

    const utilization = row.capacityLimit ? row.bookedMeals / row.capacityLimit : 0;
    this.capacityRows.update((rows) =>
      rows.map((r) =>
        r.restaurantId === restaurantId
          ? {
              ...r,
              status: utilization >= 1 ? 'busy_auto' : utilization >= 0.9 ? 'at_risk' : 'active',
              automationReason:
                utilization >= 1
                  ? 'Automatic busy remains active because booked meals meet capacity.'
                  : 'Manual busy released by operations.',
              overrideUntil: null,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    this.appendCapacityAudit(restaurantId, 'Release', 'Manual busy override released.');
  }

  private appendCapacityAudit(
    restaurantId: string,
    action: CapacityAuditEvent['action'],
    reason: string,
  ): void {
    const row = this.capacityRows().find((r) => r.restaurantId === restaurantId);
    if (!row) return;

    this.capacityAudit.update((events) => [
      {
        id: `CAP-AUD-${Date.now()}`,
        restaurantId,
        restaurantName: row.restaurantName,
        action,
        actorName: 'Operations - Current User',
        reason,
        createdAt: new Date().toISOString(),
      },
      ...events,
    ]);
  }

  toggleAutoSelectionEnabled(): void {
    this.autoSelectionRule.update((rule) => ({
      ...rule,
      enabled: !rule.enabled,
      updatedAt: new Date().toISOString(),
    }));
  }

  applyManualOverride(selectionId: string, reason: string): void {
    this.autoSelectionRows.update((rows) =>
      rows.map((row) =>
        row.id === selectionId
          ? {
              ...row,
              status: 'completed' as const,
              source: 'manual_override' as const,
              selectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : row,
      ),
    );

    this.autoSelectionAudit.update((events) => [
      {
        id: `ASA-${Date.now()}`,
        selectionId,
        action: 'ManualOverride',
        actorName: 'Operations - Current User',
        reason,
        createdAt: new Date().toISOString(),
      },
      ...events,
    ]);
  }

  canApproveMenuRequest(request: MenuApprovalRequest): boolean {
    return !this.menuRequestHasCriticalBlockers(request);
  }

  menuRequestHasCriticalBlockers(request: MenuApprovalRequest): boolean {
    return request.blockerCodes.some((code) =>
      ['missing_translation', 'missing_nutrition', 'missing_allergens', 'missing_price'].includes(code),
    );
  }

  createSampleMenuRequest(): void {
    const now = new Date().toISOString();
    const id = `MENU-REQ-${Date.now()}`;
    const request: MenuApprovalRequest = {
      id,
      restaurantId: 'RST-007',
      restaurantNameAr: 'مطعم جديد',
      restaurantNameEn: 'New Restaurant',
      requestType: 'new_meal',
      status: 'pending',
      meal: {
        id: `meal-${Date.now()}`,
        nameAr: 'وجبة جديدة للمراجعة',
        nameEn: 'New Review Meal',
        descriptionAr: 'وجبة كاملة البيانات جاهزة لاعتماد الأدمن.',
        descriptionEn: 'A complete meal submission ready for admin approval.',
        ingredientsAr: ['دجاج', 'بطاطا حلوة', 'سلطة خضراء'],
        ingredientsEn: ['Chicken', 'Sweet potato', 'Green salad'],
        allergensAr: ['لا يوجد'],
        allergensEn: ['None'],
        nutrition: {
          calories: 540,
          proteinGrams: 41,
          carbsGrams: 44,
          fatGrams: 15,
          sodiumMg: 390,
        },
        priceKd: 4.75,
        mealType: 'lunch',
        programsAr: ['رشاقة'],
        programsEn: ['Fitness'],
        bundlesAr: ['باقة الغداء'],
        bundlesEn: ['Lunch bundle'],
        labelReady: true,
        imageTone: 'sample meal box',
      },
      previousMeal: null,
      submittedAtUtc: now,
      updatedAtUtc: now,
      effectiveAtUtc: null,
      activeSubscriptionsCount: 0,
      selectedFutureOrdersCount: 0,
      reasonAr: null,
      reasonEn: null,
      blockerCodes: [],
      rowVersion: 1,
    };

    this.menuApprovalRequests.update((requests) => [request, ...requests]);
    this.appendMenuApprovalAudit(id, 'Create', 'Sample request created by operations admin.');
  }

  startMenuReview(requestId: string): void {
    this.updateMenuApprovalRequest(requestId, {
      status: 'in_review',
      updatedAtUtc: new Date().toISOString(),
    });
    this.appendMenuApprovalAudit(requestId, 'StartReview', 'Review started by operations admin.');
  }

  approveMenuRequest(requestId: string): boolean {
    const request = this.menuApprovalRequests().find((r) => r.id === requestId);
    if (!request) return false;

    if (this.menuRequestHasCriticalBlockers(request)) {
      this.requestMenuChanges(requestId, 'Critical meal data is missing.');
      return false;
    }

    const nextStatus = request.requestType === 'cancel_meal' ? 'cancellation_approved' : 'approved';
    const now = new Date();
    const effectiveAtUtc =
      request.requestType === 'cancel_meal'
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : now.toISOString();

    this.updateMenuApprovalRequest(requestId, {
      status: nextStatus,
      updatedAtUtc: now.toISOString(),
      effectiveAtUtc,
    });
    this.appendMenuApprovalAudit(
      requestId,
      request.requestType === 'cancel_meal' ? 'ApproveCancellation' : 'Approve',
      request.requestType === 'cancel_meal'
        ? 'Cancellation approved; meal remains available for existing selections for 30 days.'
        : 'Meal request approved and ready for customer-facing catalog.',
    );
    return true;
  }

  rejectMenuRequest(requestId: string, reason = 'Rejected by operations review.'): void {
    this.updateMenuApprovalRequest(requestId, {
      status: 'rejected',
      reasonAr: 'تم رفض الطلب من مراجعة العمليات.',
      reasonEn: reason,
      updatedAtUtc: new Date().toISOString(),
    });
    this.appendMenuApprovalAudit(requestId, 'Reject', reason);
  }

  requestMenuChanges(requestId: string, reason = 'Changes requested before approval.'): void {
    this.updateMenuApprovalRequest(requestId, {
      status: 'changes_requested',
      reasonAr: 'مطلوب استكمال البيانات قبل الاعتماد.',
      reasonEn: reason,
      updatedAtUtc: new Date().toISOString(),
    });
    this.appendMenuApprovalAudit(requestId, 'RequestChanges', reason);
  }

  archiveMenuRequest(requestId: string): void {
    this.updateMenuApprovalRequest(requestId, {
      status: 'archived',
      updatedAtUtc: new Date().toISOString(),
    });
    this.appendMenuApprovalAudit(requestId, 'Archive', 'Request archived from menu approval workspace.');
  }

  private updateMenuApprovalRequest(
    requestId: string,
    patch: Partial<MenuApprovalRequest>,
  ): void {
    this.menuApprovalRequests.update((requests) =>
      requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              ...patch,
              rowVersion: request.rowVersion + 1,
            }
          : request,
      ),
    );
  }

  private appendMenuApprovalAudit(
    requestId: string,
    action: MenuApprovalAuditEvent['action'],
    reason: string,
  ): void {
    this.menuApprovalAudit.update((events) => [
      {
        id: `MENU-AUD-${Date.now()}`,
        requestId,
        action,
        actorName: 'Operations - Current User',
        reason,
        createdAtUtc: new Date().toISOString(),
      },
      ...events,
    ]);
  }
}

/** @deprecated Use OperationsStore */
export { OperationsStore as OperationsStateService };
