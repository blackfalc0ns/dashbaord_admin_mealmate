import { Component, computed, inject, Input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { TABLE_PAGINATION_I18N } from './table-pagination.i18n';

@Component({
  selector: 'mm-table-pagination',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  templateUrl: './table-pagination.component.html',
  host: { class: 'block' },
})
export class MmTablePaginationComponent {
  private readonly locale = inject(AppLocaleService);

  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;
  @Input({ required: true }) totalItems!: number;
  @Input({ required: true }) pageSize!: number;
  @Input({ required: true }) itemLabel!: string;
  @Input() pageSizeOptions: number[] | null = null;
  @Input() hideWhenSinglePage = true;

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly copy = computed(() => TABLE_PAGINATION_I18N[this.locale.locale()]);

  readonly rangeStart = computed(() => {
    if (!this.totalItems) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  });

  readonly rangeEnd = computed(() =>
    Math.min(this.currentPage * this.pageSize, this.totalItems),
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages }, (_, index) => index + 1),
  );

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(size: number): void {
    if (size !== this.pageSize) {
      this.pageSizeChange.emit(size);
    }
  }
}
