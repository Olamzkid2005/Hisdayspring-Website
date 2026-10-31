"use client";

import { useState, useCallback, useMemo, type ChangeEvent, type FormEvent } from "react";
import { humanizeFieldName, isValidEmail } from "@/lib/validation";

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

function buildInitialValues<T extends FieldConfig>(fields: T): Record<keyof T, string> {
  return Object.keys(fields).reduce(
    (acc, key) => {
      acc[key as keyof T] = "";
      return acc;
    },
    {} as Record<keyof T, string>
  );
}

/**
 * Hook for form validation with real-time error checking.
 *
 * `fields` is expected to be a stable form configuration: the empty starting
 * values are captured once, so a re-render cannot silently reset a form that
 * is already being filled in.
 */
export function useFormValidation<T extends FieldConfig>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const { fields, onSubmit } = options;

  // A lazy initializer, so the empty form is built once instead of on every
  // render, and a re-render cannot reset a form that is being filled in.
  const [initialValues] = useState<Record<keyof T, string>>(() =>
    buildInitialValues(fields)
  );

  const [values, setValues] = useState<Record<keyof T, string>>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Validate a single field against its configured rules. */
  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      const rules = fields[name];
      if (!rules) return undefined;

      const label = humanizeFieldName(name);

      if (rules.required && !value.trim()) {
        return `${label} is required`;
      }

      // If empty and not required, skip the remaining checks.
      if (!value.trim()) return undefined;

      if (rules.email && !isValidEmail(value)) {
        return "Please enter a valid email address";
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.customMessage || `Invalid format for ${label}`;
      }

      if (rules.minLength && value.length < rules.minLength) {
        return `${label} must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `${label} must be no more than ${rules.maxLength} characters`;
      }

      if (rules.custom && !rules.custom(value)) {
        return rules.customMessage || `Invalid value for ${label}`;
      }

      return undefined;
    },
    [fields]
  );

  const validateAll = useCallback((): boolean => {
    const nextErrors: FormErrors = {};
    let formIsValid = true;

    for (const name of Object.keys(fields)) {
      const error = validateField(name, values[name as keyof T] || "");
      if (error) {
        nextErrors[name] = error;
        formIsValid = false;
      }
    }

    setErrors(nextErrors);
    return formIsValid;
  }, [fields, validateField, values]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear the field's error as soon as the user starts correcting it. The
      // functional update keeps this callback independent of the error object.
      setErrors((prev) =>
        prev[name] ? { ...prev, [name]: undefined } : prev
      );
    },
    []
  );

  const setFieldValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateAll()) return;

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

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Derived from every field's own rules. The previous implementation found
   * the first `required` field and applied *its* rules to every value, so a
   * mixed required/optional form could report the wrong answer.
   */
  const isValid = useMemo(
    () =>
      Object.keys(fields).every(
        (name) => !validateField(name, values[name as keyof T] || "")
      ),
    [fields, validateField, values]
  );

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
