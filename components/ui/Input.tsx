"use client";

import { forwardRef, type InputHTMLAttributes, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id: propId, className = "", ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-outline mb-1"
          >
            {label}
            {props.required && (
              <span className="text-error ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full bg-surface-container-low border-b-2 border-transparent
            focus:border-secondary outline-none p-4 rounded-lg
            transition-all duration-200
            placeholder:text-on-surface-variant/50
            disabled:bg-surface-container disabled:cursor-not-allowed
            ${error
              ? "border-error focus:border-error"
              : ""
            }
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
