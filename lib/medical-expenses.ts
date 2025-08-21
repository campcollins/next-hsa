import { MedicalExpenseCategory } from './types';

// IRS-qualified medical expense categories
export const MEDICAL_EXPENSE_CATEGORIES: MedicalExpenseCategory[] = [
  { category: 'doctor_visit', isQualified: true, description: 'Doctor office visits and consultations' },
  { category: 'prescription_medication', isQualified: true, description: 'Prescription drugs and medications' },
  { category: 'dental_care', isQualified: true, description: 'Dental treatment and procedures' },
  { category: 'vision_care', isQualified: true, description: 'Eye exams, glasses, and contact lenses' },
  { category: 'hospital_services', isQualified: true, description: 'Hospital stays and medical procedures' },
  { category: 'laboratory_tests', isQualified: true, description: 'Medical tests and laboratory services' },
  { category: 'physical_therapy', isQualified: true, description: 'Physical therapy and rehabilitation' },
  { category: 'mental_health', isQualified: true, description: 'Mental health services and therapy' },
  { category: 'medical_equipment', isQualified: true, description: 'Medical devices and equipment' },
  { category: 'health_insurance', isQualified: true, description: 'Health insurance premiums' },
  { category: 'cosmetic_surgery', isQualified: false, description: 'Cosmetic procedures not medically necessary' },
  { category: 'vitamins_supplements', isQualified: false, description: 'Vitamins and supplements (unless prescribed)' },
  { category: 'gym_membership', isQualified: false, description: 'Gym memberships and fitness programs' },
  { category: 'over_the_counter', isQualified: false, description: 'Over-the-counter medications' },
  { category: 'restaurant_food', isQualified: false, description: 'Restaurant meals and food purchases' },
  { category: 'clothing', isQualified: false, description: 'Clothing and personal items' },
  { category: 'entertainment', isQualified: false, description: 'Entertainment and recreational activities' },
];

export function isMedicalExpense(category: string): boolean {
  const expenseCategory = MEDICAL_EXPENSE_CATEGORIES.find(
    cat => cat.category === category
  );
  return expenseCategory?.isQualified || false;
}

export function getMedicalExpenseDescription(category: string): string {
  const expenseCategory = MEDICAL_EXPENSE_CATEGORIES.find(
    cat => cat.category === category
  );
  return expenseCategory?.description || 'Unknown category';
}

export function getAllCategories(): MedicalExpenseCategory[] {
  return MEDICAL_EXPENSE_CATEGORIES;
} 