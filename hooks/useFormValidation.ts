"use client";

import { useState, useCallback, type ChangeEvent, type FormEvent } from "react";

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => boolean;
  customMessage?: string;
}

export interface FieldConfig {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface UseFormValidationOptions<T extends FieldConfig> {
  fields: T;
  onSubmit?: (values: Record<keyof T, string>) => Promise<void> | void;
}

export interface UseFormValidationReturn<T extends FieldConfig> {
  values: Record<keyof T, string>;
  errors: FormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: string) => void;
}

/**
 * Hook for form validation with real-time error checking
 */
export function useFormValidation<T extends FieldConfig>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const { fields, onSubmit } = options;

  // Initialize values with empty strings
  const initialValues = Object.keys(fields).reduce(
    (acc, key) => {
      acc[key as keyof T] = "";
      return acc;
    },
    {} as Record<keyof T, string>
  );

  const [values, setValues] = useState<Record<keyof T, string>>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      const rules = fields[name as keyof T];
      if (!rules) return undefined;

      // Required check
      if (rules.required && !value.trim()) {
        return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }

      // If empty and not required, skip other validations
      if (!value.trim()) return undefined;

      // Email validation
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.customMessage || `Invalid format for ${name}`;
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} must be at least ${rules.minLength} characters`;
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} must be no more than ${rules.maxLength} characters`;
      }

      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        return rules.customMessage || `Invalid value for ${name}`;
      }

      return undefined;
    },
    [fields]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isFormValid = true;

    Object.keys(fields).forEach((name) => {
      const error = validateField(name, values[name as keyof T] || "");
      if (error) {
        newErrors[name] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [fields, validateField, values]);

  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  // Set field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const isValid = validateAll();
      if (!isValid) return;

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validateAll, onSubmit, values]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 &&
    Object.values(values).every((value) => {
      const rules = fields[Object.keys(fields).find((k) => fields[k as keyof T]?.required) as keyof T];
      if (rules?.required) {
        return value.trim().length > 0;
      }
      return true;
    });

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
}
