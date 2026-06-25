export interface AccountDocument {
  id: string;
  nameAr: string;
  nameEn: string;
  status: 'verified' | 'missing' | 'under_review' | 'expired';
  expiryDate?: string;
  uploadedAtAr?: string;
  uploadedAtEn?: string;
  fileUrl?: string;
  fileSizeKb?: number;
}

export interface PendingAccount {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'restaurant' | 'driver';
  submittedAtAr: string;
  submittedAtEn: string;
  statusAr: string;
  statusEn: string;
  statusTone: 'success' | 'warning' | 'danger';
  
  // Detailed fields
  email: string;
  phone: string;
  addressAr?: string;
  addressEn?: string;
  vehicleTypeAr?: string;
  vehicleTypeEn?: string;
  licensePlate?: string;
  
  // Kuwaiti Specific & Rich Details
  civilId?: string;
  nationalityAr?: string;
  nationalityEn?: string;
  dob?: string;
  preferredRegionsAr?: string[];
  preferredRegionsEn?: string[];
  vehicleModelAr?: string;
  vehicleModelEn?: string;
  vehicleColorAr?: string;
  vehicleColorEn?: string;
  registrationExpiry?: string;
  
  // Bank Details
  bankNameAr?: string;
  bankNameEn?: string;
  bankAccountName?: string;
  bankIban?: string;
  bankSwift?: string;
  
  // Security Checks
  criminalRecordStatusAr?: string;
  criminalRecordStatusEn?: string;
  trafficViolationsAr?: string;
  trafficViolationsEn?: string;
  paciMatchStatusAr?: string;
  paciMatchStatusEn?: string;
  
  // Associated Restaurant (السائق يتبع لمطعم)
  restaurantId?: string;
  restaurantNameAr?: string;
  restaurantNameEn?: string;
  
  // Documents
  documents: AccountDocument[];
  
  // Additional Info
  programsAr?: string[];
  programsEn?: string[];
  notesAr?: string;
  notesEn?: string;
}

export type RestaurantIngredientCategory =
  | 'meat'
  | 'chicken'
  | 'fish'
  | 'cheese'
  | 'seafood'
  | 'dairy'
  | 'eggs'
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'nuts'
  | 'oils'
  | 'herbs'
  | 'legumes'
  | 'sweeteners'
  | 'other';

export type RestaurantIngredientSourceStatus = 'verified' | 'pending' | 'needs_update';

export interface RestaurantIngredientVariety {
  nameAr: string;
  nameEn: string;
  originCountriesAr?: string[];
  originCountriesEn?: string[];
}

export interface RestaurantIngredientSource {
  id: string;
  category: RestaurantIngredientCategory;
  labelAr: string;
  labelEn: string;
  typeAr: string;
  typeEn: string;
  gradeAr?: string;
  gradeEn?: string;
  brandAr?: string;
  brandEn?: string;
  supplierAr?: string;
  supplierEn?: string;
  supplierCountryAr?: string;
  supplierCountryEn?: string;
  originCountriesAr: string[];
  originCountriesEn: string[];
  isImported: boolean;
  halalCertified?: boolean;
  halalCertAr?: string;
  halalCertEn?: string;
  certExpiry?: string;
  storageAr?: string;
  storageEn?: string;
  usedInProgramsAr?: string[];
  usedInProgramsEn?: string[];
  varieties?: RestaurantIngredientVariety[];
  menuUsagePercent?: number;
  organic?: boolean;
  frozen?: boolean;
  haccpCertified?: boolean;
  inspectionScore?: number;
  allergensAr?: string[];
  allergensEn?: string[];
  deliveryFrequencyAr?: string;
  deliveryFrequencyEn?: string;
  carbonFootprint?: 'low' | 'medium' | 'high';
  gmoFree?: boolean;
  grassFed?: boolean;
  notesAr?: string;
  notesEn?: string;
  lastUpdatedAr?: string;
  lastUpdatedEn?: string;
  status: RestaurantIngredientSourceStatus;
}

export interface RestaurantAccount {
  id: string;
  nameAr: string;
  nameEn: string;
  legalNameAr: string;
  legalNameEn: string;
  crNumber: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  addressAr: string;
  addressEn: string;
  status: 'Draft' | 'PendingDocuments' | 'SubmittedForReview' | 'NeedsChanges' | 'Rejected' | 'Approved' | 'NeedsOperationalSetup' | 'ReadyToGoLive' | 'Active' | 'Suspended' | 'Terminated';
  statusAr: string;
  statusEn: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  // Legal & registration
  companyCivilId?: string;
  crIssueDate?: string;
  crExpiryDate?: string;
  municipalityLicenseAr?: string;
  municipalityLicenseEn?: string;
  municipalityLicenseExpiry?: string;
  healthCertExpiry?: string;
  paciMatchStatusAr?: string;
  paciMatchStatusEn?: string;
  activatedAtAr?: string;
  activatedAtEn?: string;

  // Bank & settlement
  bankNameAr?: string;
  bankNameEn?: string;
  bankAccountName?: string;
  bankIban?: string;
  bankSwift?: string;
  restaurantCommissionPercent?: number;
  restaurantCommissionUpdatedAt?: string;

  // Authorized signatory
  contactCivilId?: string;
  contactRoleAr?: string;
  contactRoleEn?: string;

  // Documents
  documents: AccountDocument[];
  
  // Operational details
  programsAr: string[];
  programsEn: string[];
  serviceRegionsAr: string[];
  serviceRegionsEn: string[];
  dailyCapacity: number;
  notesAr?: string;
  notesEn?: string;

  /** Main meal protein/dairy components and import origins declared by the restaurant. */
  ingredientSources?: RestaurantIngredientSource[];
}

export interface DriverAccount {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  countryId: string;
  regionAr: string;
  regionEn: string;
  vehicleTypeAr: string;
  vehicleTypeEn: string;
  vehiclePlateNumber: string;
  profileImageUrl: string;
  profileImageStatus: 'PendingReview' | 'Approved' | 'Rejected' | 'Missing';
  status: 'Draft' | 'PendingDocuments' | 'SubmittedForReview' | 'NeedsChanges' | 'Rejected' | 'Approved' | 'Active' | 'ProfileImageReviewRequired' | 'Suspended' | 'ExpiredDocuments';
  statusAr: string;
  statusEn: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  
  // Associated Restaurant (السائق يتبع لمطعم)
  restaurantId?: string;
  restaurantNameAr?: string;
  restaurantNameEn?: string;

  // Identity
  civilId?: string;
  nationalityAr?: string;
  nationalityEn?: string;
  dob?: string;
  genderAr?: string;
  genderEn?: string;

  // Vehicle extended
  vehicleModelAr?: string;
  vehicleModelEn?: string;
  vehicleColorAr?: string;
  vehicleColorEn?: string;
  registrationExpiry?: string;

  // Bank & payout
  bankNameAr?: string;
  bankNameEn?: string;
  bankAccountName?: string;
  bankIban?: string;

  // Security & compliance
  paciMatchStatusAr?: string;
  paciMatchStatusEn?: string;
  criminalRecordStatusAr?: string;
  criminalRecordStatusEn?: string;
  trafficViolationsAr?: string;
  trafficViolationsEn?: string;

  // Employment
  joinedAtAr?: string;
  joinedAtEn?: string;
  contractTypeAr?: string;
  contractTypeEn?: string;
  
  // Documents
  documents: AccountDocument[];
  
  notesAr?: string;
  notesEn?: string;
}

export type CustomerAccountStatus =
  | 'Active'
  | 'Frozen'
  | 'NoSubscription'
  | 'Cancelled'
  | 'Suspended';

export type CustomerSubscriptionType = 'Individual' | 'Family';
export type FamilyMemberRole = 'Manager' | 'Member';

export interface FamilyMemberSummary {
  customerId: string;
  nameAr: string;
  nameEn: string;
  role: FamilyMemberRole;
  roleAr: string;
  roleEn: string;
  status: 'Active' | 'Pending' | 'Detached';
  statusAr: string;
  statusEn: string;
  quotaDays: number;
  usedDays: number;
}

export interface CustomerAccount {
  id: string;
  nameAr: string;
  nameEn: string;
  phoneNumber: string;
  email: string;
  areaAr: string;
  areaEn: string;
  status: CustomerAccountStatus;
  statusAr: string;
  statusEn: string;
  statusTone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';

  subscriptionId?: string;
  programAr?: string;
  programEn?: string;
  bundleAr?: string;
  bundleEn?: string;
  tierAr?: string;
  tierEn?: string;
  subscriptionDays?: number;
  usedDays?: number;
  subscriptionStartAr?: string;
  subscriptionStartEn?: string;

  subscriptionType?: CustomerSubscriptionType;
  familyGroupId?: string;
  familyGroupNameAr?: string;
  familyGroupNameEn?: string;
  familyRole?: FamilyMemberRole;
  familyRoleAr?: string;
  familyRoleEn?: string;
  familyManagerCustomerId?: string;
  familyManagerNameAr?: string;
  familyManagerNameEn?: string;
  familyMembers?: FamilyMemberSummary[];

  walletBalanceKd: number;
  loyaltyPoints: number;
  totalOrders: number;
  complaintsCount: number;

  joinedAtAr: string;
  joinedAtEn: string;
  lastActivityAr: string;
  lastActivityEn: string;

  allergiesAr?: string[];
  allergiesEn?: string[];
  dislikesAr?: string[];
  dislikesEn?: string[];

  notesAr?: string;
  notesEn?: string;
}
