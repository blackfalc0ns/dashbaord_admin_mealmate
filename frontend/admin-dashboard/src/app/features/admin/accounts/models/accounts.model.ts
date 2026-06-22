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
