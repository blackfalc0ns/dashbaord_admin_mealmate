export type MenuApprovalRequestType = 'new_meal' | 'meal_update' | 'cancel_meal';

export type MenuApprovalStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested'
  | 'cancellation_approved'
  | 'archived';

export type MenuReadinessStatus = 'ready' | 'needs_menu' | 'needs_pricing' | 'needs_labels';

export interface MealNutrition {
  calories: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
  sodiumMg?: number | null;
}

export interface MealDraft {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ingredientsAr: string[];
  ingredientsEn: string[];
  allergensAr: string[];
  allergensEn: string[];
  nutrition: MealNutrition;
  priceKd: number | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'salad';
  programsAr: string[];
  programsEn: string[];
  bundlesAr: string[];
  bundlesEn: string[];
  labelReady: boolean;
  imageTone: string;
}

export interface MenuApprovalRequest {
  id: string;
  restaurantId: string;
  restaurantNameAr: string;
  restaurantNameEn: string;
  requestType: MenuApprovalRequestType;
  status: MenuApprovalStatus;
  meal: MealDraft;
  previousMeal?: MealDraft | null;
  submittedAtUtc: string;
  updatedAtUtc: string;
  effectiveAtUtc?: string | null;
  activeSubscriptionsCount: number;
  selectedFutureOrdersCount: number;
  reasonAr?: string | null;
  reasonEn?: string | null;
  submittedByNameAr?: string | null;
  submittedByNameEn?: string | null;
  blockerCodes: string[];
  rowVersion: number;
}

export interface MenuApprovalAuditEvent {
  id: string;
  requestId: string;
  action: 'Create' | 'StartReview' | 'Approve' | 'Reject' | 'RequestChanges' | 'ApproveCancellation' | 'Archive';
  actorName: string;
  reason: string;
  createdAtUtc: string;
}

export interface RestaurantMenuReadiness {
  restaurantId: string;
  restaurantNameAr: string;
  restaurantNameEn: string;
  status: MenuReadinessStatus;
  approvedMeals: number;
  pendingRequests: number;
  labelReadyPercent: number;
  missingNutritionCount: number;
  missingTranslationCount: number;
  priceCoveragePercent: number;
  lastUpdatedUtc: string;
}

export interface MenuApprovalKpis {
  pending: number;
  translationIssues: number;
  nutritionIssues: number;
  cancellationRequests: number;
  notReadyRestaurants: number;
  labelReadyPercent: number;
}
