export interface AdminNavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  route?: string;
  icon: string;
  badge?: number;
  children?: AdminNavItem[];
}

export interface AdminPageContext {
  group: AdminNavItem | null;
  page: AdminNavItem | null;
}

export interface AdminNavSection {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  items: AdminNavItem[];
}
