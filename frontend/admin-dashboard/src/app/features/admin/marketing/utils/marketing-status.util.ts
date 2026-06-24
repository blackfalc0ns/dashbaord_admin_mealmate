import { InfluencerStatus } from '../models';

export function influencerStatusClasses(status: InfluencerStatus): string {
  const map: Record<InfluencerStatus, string> = {
    Draft: 'bg-slate-100 text-slate-600 ring-slate-200',
    Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Paused: 'bg-amber-50 text-amber-700 ring-amber-200',
    Suspended: 'bg-red-50 text-red-700 ring-red-200',
    BlockedForFraud: 'bg-orange-50 text-orange-800 ring-orange-200',
    Closed: 'bg-slate-100 text-slate-500 ring-slate-200',
  };
  return map[status] ?? map['Draft'];
}

export function campaignStatusClasses(status: string): string {
  const map: Record<string, string> = {
    Draft: 'bg-slate-100 text-slate-600 ring-slate-200',
    OpenForJoin: 'bg-blue-50 text-blue-700 ring-blue-200',
    Reviewed: 'bg-violet-50 text-violet-700 ring-violet-200',
    Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Stopped: 'bg-red-50 text-red-700 ring-red-200',
    Paused: 'bg-amber-50 text-amber-700 ring-amber-200',
    Ended: 'bg-slate-100 text-slate-500 ring-slate-200',
  };
  return map[status] ?? map['Draft'];
}

export function promoStatusClasses(status: string): string {
  const map: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700',
    Inactive: 'bg-slate-100 text-slate-600',
    Expired: 'bg-amber-50 text-amber-700',
    Exhausted: 'bg-red-50 text-red-700',
  };
  return map[status] ?? map['Inactive'];
}
