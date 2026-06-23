export type CatalogStatus = 'active' | 'inactive' | 'hidden_for_new';

export interface NutritionProgram {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: CatalogStatus;
  pricedRestaurantCount: number;
  activeSubscriptionCount: number;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}
