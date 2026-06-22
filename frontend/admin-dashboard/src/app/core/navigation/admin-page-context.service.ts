import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ADMIN_NAV_ITEMS } from './admin-nav.config';
import { AdminNavItem, AdminPageContext } from './admin-nav.model';
import { BreadcrumbItem } from '@/shared/models/breadcrumb-item.model';

@Injectable({ providedIn: 'root' })
export class AdminPageContextService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly url = signal(this.router.url);

  readonly context = computed(() => resolvePageContext(this.url()));

  // Custom Overrides for Toolbar
  readonly customTitle = signal<string | null>(null);
  readonly customDescription = signal<string | null>(null);
  readonly customBreadcrumbs = signal<BreadcrumbItem[] | null>(null);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.url.set((event as NavigationEnd).urlAfterRedirects);
      });
  }
}

function resolvePageContext(url: string): AdminPageContext {
  const path = url.split('?')[0];
  let best: { group: AdminNavItem | null; page: AdminNavItem; len: number } | null =
    null;

  for (const group of ADMIN_NAV_ITEMS) {
    const pages = group.children?.length
      ? group.children
      : group.route
        ? [group]
        : [];

    for (const page of pages) {
      if (!page.route || !path.startsWith(page.route)) {
        continue;
      }

      if (!best || page.route.length > best.len) {
        best = {
          group: group.children?.length ? group : null,
          page,
          len: page.route.length,
        };
      }
    }
  }

  return best
    ? { group: best.group, page: best.page }
    : { group: null, page: null };
}

export function findNavItemByRoute(
  items: AdminNavItem[],
  route: string,
): AdminNavItem | null {
  for (const item of items) {
    if (item.route === route) {
      return item;
    }

    if (item.children) {
      const match = findNavItemByRoute(item.children, route);
      if (match) {
        return match;
      }
    }
  }

  return null;
}
