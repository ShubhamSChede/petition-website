// src/lib/utils/validation.ts
export const VALID_BIOID_REGEX = /^[A-Z0-9]{10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegistration(data: {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  bioId: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Email validation
  if (!EMAIL_REGEX.test(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }

  // Password validation
  if (data.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long'
    });
  }

  // Full name validation
  if (data.fullName.trim().length < 2) {
    errors.push({
      field: 'fullName',
      message: 'Full name is required'
    });
  }

  // Date of birth validation
  const dob = new Date(data.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  if (age < 18) {
    errors.push({
      field: 'dateOfBirth',
      message: 'You must be at least 18 years old'
    });
  }

  // BioID validation
  if (!VALID_BIOID_REGEX.test(data.bioId)) {
    errors.push({
      field: 'bioId',
      message: 'Please enter a valid 10-character BioID'
    });
  }

  return errors;
}

export function validatePetition(data: {
  title: string;
  content: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.title.trim().length < 10) {
    errors.push({
      field: 'title',
      message: 'Title must be at least 10 characters long'
    });
  }

  if (data.content.trim().length < 50) {
    errors.push({
      field: 'content',
      message: 'Content must be at least 50 characters long'
    });
  }

  return errors;
}

export function validateThreshold(threshold: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isNaN(threshold) || threshold < 1) {
    errors.push({
      field: 'threshold',
      message: 'Threshold must be a positive number'
    });
  }

  return errors;
}