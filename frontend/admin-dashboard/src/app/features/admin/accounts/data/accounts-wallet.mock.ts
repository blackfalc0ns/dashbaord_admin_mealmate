import type { RestaurantAccount } from '../models/accounts.model';

export type WalletTransactionType = 'credit' | 'debit';
export type WalletTransactionStatus = 'posted' | 'pending' | 'reversed';
export type SettlementBatchStatus = 'paid' | 'pending' | 'processing';

export interface RestaurantWalletTransaction {
  id: string;
  dateAr: string;
  dateEn: string;
  type: WalletTransactionType;
  categoryAr: string;
  categoryEn: string;
  amountKwd: number;
  ref: string;
  status: WalletTransactionStatus;
}

export interface RestaurantSettlementBatch {
  id: string;
  periodAr: string;
  periodEn: string;
  deliveredBoxes: number;
  grossKwd: number;
  restaurantCommissionKwd: number;
  complaintDeductionsKwd: number;
  netKwd: number;
  status: SettlementBatchStatus;
  paidAtAr?: string;
  paidAtEn?: string;
}

export interface RestaurantWalletSnapshot {
  availableBalance: number;
  pendingSettlement: number;
  lastTransferAmount: number;
  lastTransferAtAr: string;
  lastTransferAtEn: string;
  nextSettlementDateAr: string;
  nextSettlementDateEn: string;
  transactions: RestaurantWalletTransaction[];
  settlements: RestaurantSettlementBatch[];
}

function hashId(id: string): number {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function roundKwd(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function formatKwd(amount: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} د.ك`;
}

export function buildRestaurantWallet(restaurant: RestaurantAccount): RestaurantWalletSnapshot {
  const seed = hashId(restaurant.id);
  const isActive = restaurant.status === 'Active';
  const dailyMeals = isActive
    ? Math.max(20, Math.round(restaurant.dailyCapacity * (0.68 + (seed % 17) / 100)))
    : Math.max(8, Math.round(restaurant.dailyCapacity * 0.25));
  const boxPrice = 4.65 + (seed % 16) * 0.11;
  const commissionRate = (restaurant.restaurantCommissionPercent ?? 12) / 100;

  const settlements: RestaurantSettlementBatch[] = [
    buildSettlement('STL-2406', 'يونيو 2026 (1–15)', 'Jun 2026 (1–15)', dailyMeals, boxPrice, commissionRate, seed, 'processing'),
    buildSettlement('STL-2405', 'مايو 2026 (16–31)', 'May 2026 (16–31)', dailyMeals, boxPrice, commissionRate, seed + 1, 'paid', '5 يونيو 2026', '5 Jun 2026'),
    buildSettlement('STL-2404', 'مايو 2026 (1–15)', 'May 2026 (1–15)', dailyMeals, boxPrice, commissionRate, seed + 2, 'paid', '20 مايو 2026', '20 May 2026'),
    buildSettlement('STL-2403', 'أبريل 2026 (16–30)', 'Apr 2026 (16–30)', dailyMeals, boxPrice, commissionRate, seed + 3, 'paid', '5 مايو 2026', '5 May 2026'),
  ];

  const pendingSettlement = settlements.find((s) => s.status === 'processing')?.netKwd ?? 0;
  const paidTotal = settlements
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + s.netKwd, 0);
  const complaintHold = roundKwd(pendingSettlement * 0.03);
  const availableBalance = roundKwd(Math.max(0, paidTotal * 0.08 - complaintHold));

  const lastPaid = settlements.find((s) => s.status === 'paid');
  const transactions = buildTransactions(restaurant.id, settlements, seed);

  return {
    availableBalance,
    pendingSettlement,
    lastTransferAmount: lastPaid?.netKwd ?? 0,
    lastTransferAtAr: lastPaid?.paidAtAr ?? '—',
    lastTransferAtEn: lastPaid?.paidAtEn ?? '—',
    nextSettlementDateAr: '20 يونيو 2026',
    nextSettlementDateEn: '20 Jun 2026',
    transactions,
    settlements,
  };
}

function buildSettlement(
  id: string,
  periodAr: string,
  periodEn: string,
  dailyMeals: number,
  boxPrice: number,
  commissionRate: number,
  seed: number,
  status: SettlementBatchStatus,
  paidAtAr?: string,
  paidAtEn?: string,
): RestaurantSettlementBatch {
  const activeDays = 12;
  const variance = 1 + ((seed % 9) - 4) / 100;
  const deliveredBoxes = Math.round(dailyMeals * activeDays * variance);
  const grossKwd = roundKwd(deliveredBoxes * boxPrice);
  const restaurantCommissionKwd = roundKwd(grossKwd * commissionRate);
  const complaintDeductionsKwd = roundKwd(grossKwd * (0.005 + (seed % 3) / 1000));
  const netKwd = roundKwd(grossKwd - restaurantCommissionKwd - complaintDeductionsKwd);

  return {
    id,
    periodAr,
    periodEn,
    deliveredBoxes,
    grossKwd,
    restaurantCommissionKwd,
    complaintDeductionsKwd,
    netKwd,
    status,
    paidAtAr,
    paidAtEn,
  };
}

function buildTransactions(
  restaurantId: string,
  settlements: RestaurantSettlementBatch[],
  seed: number,
): RestaurantWalletTransaction[] {
  const paid = settlements.filter((s) => s.status === 'paid');
  const pending = settlements.find((s) => s.status === 'processing');

  const rows: RestaurantWalletTransaction[] = [];

  if (pending) {
    rows.push({
      id: `TX-${restaurantId}-001`,
      dateAr: '16 يونيو 2026',
      dateEn: '16 Jun 2026',
      type: 'credit',
      categoryAr: 'استحقاق تسوية قيد المعالجة',
      categoryEn: 'Settlement accrual (processing)',
      amountKwd: pending.netKwd,
      ref: pending.id,
      status: 'pending',
    });
  }

  paid.forEach((batch, index) => {
    rows.push({
      id: `TX-${restaurantId}-0${index + 2}`,
      dateAr: batch.paidAtAr ?? '—',
      dateEn: batch.paidAtEn ?? '—',
      type: 'credit',
      categoryAr: 'تحويل تسوية بنكي',
      categoryEn: 'Bank settlement transfer',
      amountKwd: batch.netKwd,
      ref: batch.id,
      status: 'posted',
    });

    if (batch.complaintDeductionsKwd > 0) {
      rows.push({
        id: `TX-${restaurantId}-D${index + 1}`,
        dateAr: batch.paidAtAr ?? '—',
        dateEn: batch.paidAtEn ?? '—',
        type: 'debit',
        categoryAr: 'خصم شكاوى جودة',
        categoryEn: 'Quality complaint deduction',
        amountKwd: batch.complaintDeductionsKwd,
        ref: `CMP-${batch.id}`,
        status: 'posted',
      });
    }
  });

  if (seed % 2 === 0) {
    rows.push({
      id: `TX-${restaurantId}-SUB`,
      dateAr: '1 يونيو 2026',
      dateEn: '1 Jun 2026',
      type: 'debit',
      categoryAr: 'رسوم اشتراك المنصة (شهرية)',
      categoryEn: 'Platform subscription fee (monthly)',
      amountKwd: roundKwd(25 + (seed % 5)),
      ref: 'SUB-2026-06',
      status: 'posted',
    });
  }

  return rows;
}
