export type LoginLocale = 'ar' | 'en';

export interface LoginCopy {
  langSwitch: string;
  authHeroAlt: string;
  brandTaglineLead: string;
  brandTaglineAccent: string;
  brandTitleLead: string;
  brandTitleAccent: string;
  brandDescBefore: string;
  brandDescHighlight: string;
  pillarHealth: string;
  pillarSubscriptions: string;
  pillarManagement: string;
  formEyebrow: string;
  formTitle: string;
  formSubtitle: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  rememberSession: string;
  submit: string;
  submitting: string;
  showPassword: string;
  hidePassword: string;
  footerRights: string;
  footerSecure: string;
  footerCopyright: string;
}

export const LOGIN_I18N: Record<LoginLocale, LoginCopy> = {
  ar: {
    langSwitch: 'English',
    authHeroAlt: 'MealMate — منظومة الوجبات الصحية',
    brandTaglineLead: 'أكل صحي',
    brandTaglineAccent: 'حياة أسهل',
    brandTitleLead: 'منظومة متكاملة',
    brandTitleAccent: 'للوجبات',
    brandDescBefore: 'اشتراكات ذكية تربط العملاء والمطاعم والتوصيل —',
    brandDescHighlight: 'إدارة مركزية واحدة.',
    pillarHealth: 'صحة يومية',
    pillarSubscriptions: 'خطط مرنة',
    pillarManagement: 'تحكم شامل',
    formEyebrow: 'لوحة المسؤول',
    formTitle: 'تسجيل دخول المسؤول',
    formSubtitle: 'قم بإدخال بيانات الاعتماد للوصول إلى النظام',
    identifierLabel: 'البريد الإلكتروني أو رقم الهاتف',
    identifierPlaceholder: 'البريد أو رقم الهاتف',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberSession: 'تذكّرني على هذا الجهاز',
    submit: 'تسجيل الدخول',
    submitting: 'جاري التحقق...',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    footerRights: 'جميع الحقوق محفوظة.',
    footerSecure: 'اتصال آمن',
    footerCopyright: '© 2026 MealMate',
  },
  en: {
    langSwitch: 'العربية',
    authHeroAlt: 'MealMate — Healthy meal ecosystem',
    brandTaglineLead: 'Healthy eating',
    brandTaglineAccent: 'Made simple',
    brandTitleLead: 'One connected',
    brandTitleAccent: 'meal platform',
    brandDescBefore: 'Smart subscriptions linking customers, restaurants, and delivery —',
    brandDescHighlight: 'managed from one hub.',
    pillarHealth: 'Daily wellness',
    pillarSubscriptions: 'Flexible plans',
    pillarManagement: 'Full control',
    formEyebrow: 'Admin Panel',
    formTitle: 'Sign In',
    formSubtitle: 'Enter your credentials to continue',
    identifierLabel: 'Email or phone number',
    identifierPlaceholder: 'Email or phone',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot password?',
    rememberSession: 'Remember me on this device',
    submit: 'Sign In',
    submitting: 'Verifying...',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    footerRights: 'All rights reserved.',
    footerSecure: 'Secure connection',
    footerCopyright: '© 2026 MealMate',
  },
};
