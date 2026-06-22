import { Component, inject, computed, signal, OnInit, DestroyRef, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideUser,
  lucidePhone,
  lucideMail,
  lucideMapPin,
  lucideCar,
  lucideFileText,
  lucideCheck,
  lucideClock,
  lucideX,
  lucideShieldCheck,
  lucideShieldAlert,
  lucideArrowLeft,
  lucideCalendar,
  lucideGlobe,
  lucideCreditCard,
  lucideBuilding,
  lucideEye,
} from '@ng-icons/lucide';
import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { PENDING_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/pending-accounts.i18n';
import { AccountsStateService } from '../../data/accounts-state.service';
import { PendingAccount } from '../../models/accounts.model';
import { AdminPageContextService } from '../../../../../core/navigation/admin-page-context.service';

@Component({
  selector: 'mm-pending-account-detail-page',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink, NgIconComponent],
  templateUrl: './pending-account-detail-page.component.html',
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideUser,
      lucidePhone,
      lucideMail,
      lucideMapPin,
      lucideCar,
      lucideFileText,
      lucideCheck,
      lucideClock,
      lucideX,
      lucideShieldCheck,
      lucideShieldAlert,
      lucideArrowLeft,
      lucideCalendar,
      lucideGlobe,
      lucideCreditCard,
      lucideBuilding,
      lucideEye,
    }),
  ],
})
export class PendingAccountDetailPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly stateService = inject(AccountsStateService);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);

  readonly copy = computed(() => PENDING_ACCOUNTS_I18N[this.locale.locale()]);

  readonly accountId = signal<string | null>(null);

  // Find account from centralized state service
  readonly account = computed<PendingAccount | null>(() => {
    const id = this.accountId();
    if (!id) return null;
    return this.stateService.accounts().find((a) => a.id === id) || null;
  });

  // Track currently selected document for preview
  readonly selectedDocId = signal<string | null>(null);

  readonly selectedDoc = computed(() => {
    const item = this.account();
    const docId = this.selectedDocId();
    if (!item || !docId) return null;
    return item.documents.find((d) => d.id === docId) || null;
  });

  // Toast Feedback State
  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'warning' | 'info'>('success');

  constructor() {
    // Dynamically update global header
    effect(() => {
      const item = this.account();
      if (item) {
        const title = this.t(item.nameAr, item.nameEn);
        const desc = `${this.copy().requestId} ${item.id} • ${this.copy().submittedAt} ${this.t(item.submittedAtAr, item.submittedAtEn)}`;
        
        this.pageContext.customTitle.set(title);
        this.pageContext.customDescription.set(desc);
        
        // Custom breadcrumbs
        const sectionLabel = this.locale.isRtl() ? 'الحسابات' : 'Accounts';
        const groupLabel = this.locale.isRtl() ? 'اعتماد الحسابات' : 'Account Approvals';
        const pageLabel = this.copy().pendingApprovals;
        const itemLabel = this.t(item.nameAr, item.nameEn);
        
        this.pageContext.customBreadcrumbs.set([
          { label: sectionLabel },
          { label: groupLabel },
          { label: pageLabel, route: '/admin/accounts/pending' },
          { label: itemLabel, active: true }
        ]);

        // Select first document as default preview
        if (item.documents.length && !this.selectedDocId()) {
          this.selectedDocId.set(item.documents[0].id);
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      this.pageContext.customTitle.set(null);
      this.pageContext.customDescription.set(null);
      this.pageContext.customBreadcrumbs.set(null);
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accountId.set(id);
    } else {
      this.router.navigate(['/admin/accounts/pending']);
    }
  }

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  toggleDocStatus(docId: string): void {
    // Just select the document for preview instead of toggling directly,
    // or select it first.
    this.selectedDocId.set(docId);
  }

  changeDocStatus(docId: string, status: 'verified' | 'under_review' | 'missing'): void {
    const currentAccount = this.account();
    if (!currentAccount) return;

    this.stateService.accounts.update((list) =>
      list.map((a) => {
        if (a.id === currentAccount.id) {
          const updatedDocs = a.documents.map((d) => {
            if (d.id === docId) {
              return { ...d, status };
            }
            return d;
          });

          // Recalculate status tone based on documents
          const hasMissing = updatedDocs.some((d) => d.status === 'missing');
          const allVerified = updatedDocs.every((d) => d.status === 'verified');
          const statusTone = allVerified
            ? 'success'
            : hasMissing
              ? 'danger'
              : 'warning';
          const statusAr = allVerified
            ? 'جاهز للاعتماد'
            : hasMissing
              ? 'وثائق ناقصة'
              : 'قيد المراجعة';
          const statusEn = allVerified
            ? 'Ready to approve'
            : hasMissing
              ? 'Missing documents'
              : 'Under review';

          return {
            ...a,
            documents: updatedDocs,
            statusTone,
            statusAr,
            statusEn,
          };
        }
        return a;
      })
    );

    this.showToast(
      this.locale.isRtl() ? 'تم تحديث حالة المستند بنجاح' : 'Document status updated successfully',
      'info'
    );
  }

  approveAccount(): void {
    const currentAccount = this.account();
    if (!currentAccount) return;

    // Check if any document is missing
    const hasMissing = currentAccount.documents.some((d) => d.status === 'missing');
    if (hasMissing) {
      this.showToast(
        this.locale.isRtl()
          ? 'لا يمكن اعتماد الحساب لوجود وثائق ناقصة'
          : 'Cannot approve account due to missing documents',
        'warning'
      );
      return;
    }

    this.stateService.approvePendingAccount(currentAccount.id);
    this.showToast(
      this.locale.isRtl()
        ? 'تم اعتماد وتفعيل الحساب بنجاح! جاري توجيهك...'
        : 'Account approved and activated successfully! Redirecting...',
      'success'
    );

    setTimeout(() => {
      this.router.navigate(['/admin/accounts/pending']);
    }, 1500);
  }

  rejectAccount(): void {
    const currentAccount = this.account();
    if (!currentAccount) return;

    const reasonAr = 'تم رفض الطلب لعدم استيفاء الشروط القانونية أو التشغيلية.';
    const reasonEn = 'Request rejected for not meeting legal or operational terms.';

    this.stateService.rejectPendingAccount(currentAccount.id, reasonAr, reasonEn);
    this.showToast(
      this.locale.isRtl() ? 'تم رفض طلب الاعتماد' : 'Approval request rejected',
      'warning'
    );
  }

  requestMoreDocs(): void {
    const currentAccount = this.account();
    if (!currentAccount) return;

    this.showToast(
      this.locale.isRtl()
        ? 'تم إرسال تنبيه للمستخدم لاستكمال النواقص'
        : 'Alert sent to user to complete missing documents',
      'info'
    );
  }

  private showToast(message: string, type: 'success' | 'warning' | 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
