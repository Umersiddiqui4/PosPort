import { useState, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';

interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: ValidationRule[];
  zodSchema?: z.ZodSchema;
}

interface FieldValidation {
  value: any;
  isValid: boolean;
  errors: string[];
  isTouched: boolean;
  isDirty: boolean;
}

interface FormValidation {
  [fieldName: string]: FieldValidation;
}

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  debounceMs?: number;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, ValidationConfig>,
  options: UseFormValidationOptions = {}
) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    debounceMs = 300
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [validation, setValidation] = useState<FormValidation>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize validation state
  useEffect(() => {
    const initialValidation: FormValidation = {};
    Object.keys(initialValues).forEach(fieldName => {
      initialValidation[fieldName] = {
        value: initialValues[fieldName],
        isValid: true,
        errors: [],
        isTouched: false,
        isDirty: false
      };
    });
    setValidation(initialValidation);
  }, [initialValues]);

  // Validation function
  const validateField = useCallback((fieldName: string, value: any): string[] => {
    const config = validationSchema[fieldName as keyof T];
    if (!config) return [];

    const errors: string[] = [];

    // Required validation
    if (config.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push('This field is required');
    }

    // Skip other validations if value is empty and not required
    if (!value && !config.required) {
      return errors;
    }

    // Length validations
    if (typeof value === 'string') {
      if (config.minLength && value.length < config.minLength) {
        errors.push(`Minimum length is ${config.minLength} characters`);
      }
      if (config.maxLength && value.length > config.maxLength) {
        errors.push(`Maximum length is ${config.maxLength} characters`);
      }
    }

    // Pattern validation
    if (config.pattern && typeof value === 'string' && !config.pattern.test(value)) {
      errors.push('Invalid format');
    }

    // Custom validation rules
    if (config.custom) {
      config.custom.forEach(rule => {
        if (!rule.test(value)) {
          errors.push(rule.message);
        }
      });
    }

    // Zod validation
    if (config.zodSchema) {
      try {
        config.zodSchema.parse(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...error.errors.map(e => e.message));
        }
      }
    }

    return errors;
  }, [validationSchema]);

  // Update field value
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear existing debounce timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    // Debounced validation
    if (validateOnChange) {
      debounceTimers.current[fieldName] = setTimeout(() => {
        const errors = validateField(fieldName, value);
        setValidation(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            value,
            isValid: errors.length === 0,
            errors,
            isDirty: true
          }
        }));
      }, debounceMs);
    }
  }, [validateField, validateOnChange, debounceMs]);

  // Handle field blur
  const handleFieldBlur = useCallback((fieldName: string) => {
    if (!validateOnBlur) return;

    const value = values[fieldName];
    const errors = validateField(fieldName, value);
    
    setValidation(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isValid: errors.length === 0,
        errors,
        isTouched: true
      }
    }));
  }, [values, validateField, validateOnBlur]);

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newValidation: FormValidation = {};
    let isValid = true;

    Object.keys(values).forEach(fieldName => {
      const errors = validateField(fieldName, values[fieldName]);
      newValidation[fieldName] = {
        value: values[fieldName],
        isValid: errors.length === 0,
        errors,
        isTouched: true,
        isDirty: true
      };
      
      if (errors.length > 0) {
        isValid = false;
      }
    });

    setValidation(newValidation);
    return isValid;
  }, [values, validateField]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setValidation({});
    setSubmitErrors([]);
    setIsSubmitting(false);
    
    // Clear all debounce timers
    Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    debounceTimers.current = {};
  }, [initialValues]);

  // Submit form
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true);
    setSubmitErrors([]);

    try {
      if (validateOnSubmit && !validateAll()) {
        setIsSubmitting(false);
        return;
      }

      await onSubmit(values);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubmitErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateOnSubmit, validateAll]);

  // Get field props for easy integration
  const getFieldProps = useCallback((fieldName: string) => {
    const fieldValidation = validation[fieldName];
    
    return {
      value: fieldValidation?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFieldValue(fieldName, e.target.value);
      },
      onBlur: () => handleFieldBlur(fieldName),
      'aria-invalid': fieldValidation?.isTouched && !fieldValidation?.isValid,
      'aria-describedby': fieldValidation?.isTouched && fieldValidation?.errors.length > 0 
        ? `${fieldName}-error` 
        : undefined
    };
  }, [validation, setFieldValue, handleFieldBlur]);

  // Check if form is valid
  const isFormValid = useCallback(() => {
    return Object.values(validation).every(field => field.isValid);
  }, [validation]);

  // Get all errors
  const getAllErrors = useCallback(() => {
    const errors: string[] = [];
    Object.values(validation).forEach(field => {
      errors.push(...field.errors);
    });
    errors.push(...submitErrors);
    return errors;
  }, [validation, submitErrors]);

  return {
    values,
    validation,
    isSubmitting,
    submitErrors,
    setFieldValue,
    handleFieldBlur,
    validateAll,
    reset,
    handleSubmit,
    getFieldProps,
    isFormValid,
    getAllErrors
  };
};

// Predefined validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value !== null && value !== undefined && value !== '',
    message
  }),
  
  email: (message = 'Invalid email address'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  phone: (message = 'Invalid phone number'): ValidationRule => ({
    test: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
    message
  }),
  
  url: (message = 'Invalid URL'): ValidationRule => ({
    test: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),
  
  numeric: (message = 'Must be a number'): ValidationRule => ({
    test: (value) => !isNaN(Number(value)) && isFinite(Number(value)),
    message
  }),
  
  positive: (message = 'Must be a positive number'): ValidationRule => ({
    test: (value) => Number(value) > 0,
    message
  }),
  
  minValue: (min: number, message?: string): ValidationRule => ({
    test: (value) => Number(value) >= min,
    message: message || `Must be at least ${min}`
  }),
  
  maxValue: (max: number, message?: string): ValidationRule => ({
    test: (value) => Number(value) <= max,
    message: message || `Must be at most ${max}`
  }),
  
  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'): ValidationRule => ({
    test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message
  }),
  
  strongPassword: (message = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character'): ValidationRule => ({
    test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(value),
    message
  })
};

// Common Zod schemas
export const zodSchemas = {
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
  url: z.string().url('Invalid URL'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number, and special character'),
  strongPassword: z.string().min(12, 'Password must be at least 12 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number, and special character'),
  numeric: z.number().or(z.string().transform((val) => Number(val))),
  positive: z.number().positive('Must be a positive number'),
  integer: z.number().int('Must be an integer')
};
