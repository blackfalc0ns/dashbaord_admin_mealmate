import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBanknote, lucideBoxes, lucideCheck, lucideChevronDown, lucideCircleAlert, lucideClock3, lucideDownload, lucideReceipt, lucideSearch, lucideTrendingDown, lucideWalletCards } from '@ng-icons/lucide';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { AccountsStateService } from '../../../accounts/data/accounts-state.service';
import { buildRestaurantWallet } from '../../../accounts/data/accounts-wallet.mock';

type Status = 'processing' | 'pending' | 'paid' | 'disputed';
type Row = { id: string; restaurantId: string; restaurantAr: string; restaurantEn: string; periodAr: string; periodEn: string; deliveredBoxes: number; gross: number; commission: number; deductions: number; net: number; status: Status };

@Component({
  selector: 'mm-settlements-workspace-page', standalone: true,
  imports: [DecimalPipe, NgClass, FormsModule, NgIcon, MmTablePaginationComponent],
  providers: [provideIcons({ lucideBanknote, lucideBoxes, lucideCheck, lucideChevronDown, lucideCircleAlert, lucideClock3, lucideDownload, lucideReceipt, lucideSearch, lucideTrendingDown, lucideWalletCards })],
  templateUrl: './settlements-workspace-page.component.html',
  styleUrl: './settlements-workspace-page.component.scss',
  host: { class: 'block' },
})
export class SettlementsWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  private readonly accounts = inject(AccountsStateService);
  readonly search = signal(''); readonly status = signal<'all' | Status>('all'); readonly period = signal('current'); readonly refreshing = signal(false);
  readonly selected = signal<Row | null>(null); readonly toast = signal('');
  readonly pg = createTablePagination(7); readonly currentPage = this.pg.currentPage; readonly pageSize = this.pg.pageSize;
  readonly text = computed(() => this.locale.isRtl() ? {
    total:'إجمالي المستحقات', pending:'بانتظار الاعتماد', paid:'تم صرفها', deductions:'إجمالي الخصومات', cycle:'دورة التسوية', current:'الدورة الحالية', previous:'الدورة السابقة', all:'كل الحالات', processing:'قيد المراجعة', pendingStatus:'جاهزة للصرف', paidStatus:'مدفوعة', disputed:'نزاع', export:'تصدير', search:'ابحث باسم المطعم أو رقم التسوية...', pipeline:'مسار التسويات', restaurant:'المطعم', period:'الفترة', boxes:'الصناديق المسلّمة', gross:'الإجمالي', commission:'عمولة المنصة', deducted:'الخصومات', net:'صافي المستحق', status:'الحالة', action:'إجراء', details:'عرض التفاصيل', approve:'اعتماد وصرف', ledger:'سجل تسويات المطاعم', ledgerSub:'التسوية مبنية على الصناديق المسلّمة فعليًا بعد العمولات والخصومات', items:'تسوية', currency:'د.ك', noData:'لا توجد تسويات مطابقة', approved:'تم اعتماد التسوية وتحويلها للصرف', formula:'معادلة التسوية', formulaText:'صافي المستحق = إجمالي الصناديق − عمولة المنصة − خصومات الشكاوى', close:'إغلاق'
  } : {
    total:'Total payable', pending:'Awaiting approval', paid:'Paid settlements', deductions:'Total deductions', cycle:'Settlement cycle', current:'Current cycle', previous:'Previous cycle', all:'All statuses', processing:'Under review', pendingStatus:'Ready to pay', paidStatus:'Paid', disputed:'Disputed', export:'Export', search:'Search restaurant or settlement ID...', pipeline:'Settlement pipeline', restaurant:'Restaurant', period:'Period', boxes:'Delivered boxes', gross:'Gross', commission:'Platform commission', deducted:'Deductions', net:'Net payable', status:'Status', action:'Action', details:'View details', approve:'Approve & pay', ledger:'Restaurant settlements ledger', ledgerSub:'Based on actually delivered boxes after commissions and deductions', items:'settlements', currency:'KD', noData:'No matching settlements', approved:'Settlement approved and queued for payout', formula:'Settlement formula', formulaText:'Net payable = box gross − platform commission − complaint deductions', close:'Close'
  });
  readonly rows = signal<Row[]>(this.accounts.restaurants().flatMap((restaurant, ri) => buildRestaurantWallet(restaurant).settlements.map((s, si) => ({
    id: `${restaurant.id}-${s.id}`, restaurantId: restaurant.id, restaurantAr: restaurant.nameAr, restaurantEn: restaurant.nameEn, periodAr: s.periodAr, periodEn: s.periodEn,
    deliveredBoxes: s.deliveredBoxes, gross: s.grossKwd, commission: s.restaurantCommissionKwd, deductions: s.complaintDeductionsKwd, net: s.netKwd,
    status: (si === 0 ? (ri === 2 ? 'disputed' : ri === 1 ? 'pending' : 'processing') : 'paid') as Status,
  }))));
  readonly filtered = computed(() => { const q=this.search().toLowerCase().trim(); return this.rows().filter(r => (this.status()==='all'||r.status===this.status()) && (this.period()==='all'||(this.period()==='current' ? r.periodEn.includes('Jun 2026') : !r.periodEn.includes('Jun 2026'))) && (!q||r.restaurantAr.toLowerCase().includes(q)||r.restaurantEn.toLowerCase().includes(q)||r.id.toLowerCase().includes(q))); });
  readonly paginated = this.pg.paginated(this.filtered); readonly totalPages = this.pg.totalPages(this.filtered);
  readonly stats = computed(() => ({ total:this.filtered().reduce((s,r)=>s+r.net,0), pending:this.filtered().filter(r=>r.status==='processing'||r.status==='pending').reduce((s,r)=>s+r.net,0), paid:this.filtered().filter(r=>r.status==='paid').reduce((s,r)=>s+r.net,0), deductions:this.filtered().reduce((s,r)=>s+r.deductions,0) }));
  readonly counts = computed(() => ({ review:this.rows().filter(r=>r.status==='processing').length, ready:this.rows().filter(r=>r.status==='pending').length, paid:this.rows().filter(r=>r.status==='paid').length, dispute:this.rows().filter(r=>r.status==='disputed').length }));
  name(r:Row){return this.locale.isRtl()?r.restaurantAr:r.restaurantEn} periodName(r:Row){return this.locale.isRtl()?r.periodAr:r.periodEn}
  label(s:Status){const t=this.text();return s==='paid'?t.paidStatus:s==='pending'?t.pendingStatus:s==='disputed'?t.disputed:t.processing}
  tone(s:Status){return s==='paid'?'bg-emerald-50 text-emerald-700 ring-emerald-600/15':s==='pending'?'bg-sky-50 text-sky-700 ring-sky-600/15':s==='disputed'?'bg-rose-50 text-rose-700 ring-rose-600/15':'bg-amber-50 text-amber-700 ring-amber-600/15'}
  filterChanged(){this.pg.resetPage();this.refreshing.set(false);requestAnimationFrame(()=>this.refreshing.set(true));setTimeout(()=>this.refreshing.set(false),450)}
  approve(r:Row){this.rows.update(rows=>rows.map(x=>x.id===r.id?{...x,status:'paid'}:x));this.selected.set(null);this.toast.set(this.text().approved);setTimeout(()=>this.toast.set(''),2500)}
  onPageChange(p:number){this.pg.onPageChange(p,this.totalPages())}
  export(){const t=this.text();const data=[[t.restaurant,t.period,t.boxes,t.gross,t.commission,t.deducted,t.net,t.status],...this.filtered().map(r=>[this.name(r),this.periodName(r),r.deliveredBoxes,r.gross,r.commission,r.deductions,r.net,this.label(r.status)])];const csv='\uFEFF'+data.map(x=>x.map(v=>`"${v}"`).join(',')).join('\n');const u=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=u;a.download='restaurant-settlements.csv';a.click();URL.revokeObjectURL(u)}
}
