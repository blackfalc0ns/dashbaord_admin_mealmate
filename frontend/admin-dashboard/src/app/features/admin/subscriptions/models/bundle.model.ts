import { CatalogStatus } from './program.model';

export interface BundleComponents {
  breakfast: boolean;
  mainMeals: number;
  snack: boolean;
  salad: boolean;
}

export interface MealBundle {
  id: string;
  nameAr: string;
  nameEn: string;
  components: BundleComponents;
  isCustom: boolean;
  status: CatalogStatus;
  pricedRestaurantCount: number;
  activeSubscriptionCount: number;
  isReady: boolean;
  createdAt: string;
  updatedAt: string;
}
