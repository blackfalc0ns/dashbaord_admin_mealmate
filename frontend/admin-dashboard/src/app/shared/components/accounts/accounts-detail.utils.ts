import { AppLocaleService } from '../../../core/i18n/app-locale.service';
import type { AccountDocument } from '../../../features/admin/accounts/models/accounts.model';

export function t(locale: AppLocaleService, ar: string, en: string): string {
  return locale.isRtl() ? ar : en;
}

export function docStatusLabel(locale: AppLocaleService, status: AccountDocument['status']): string {
  const map: Record<AccountDocument['status'], { ar: string; en: string }> = {
    verified: { ar: 'معتمد', en: 'Verified' },
    under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
    missing: { ar: 'ناقص', en: 'Missing' },
    expired: { ar: 'منتهي', en: 'Expired' },
  };
  const entry = map[status];
  return t(locale, entry.ar, entry.en);
}
