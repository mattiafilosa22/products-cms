"use client";

import React, { useCallback, useMemo } from "react";
import { Controller, Noop, RegisterOptions } from "react-hook-form";
import styles from "./form-field.module.scss";
import { InputConfig } from "../input-config";

export interface FormFieldProps {
  children: React.ReactNode;
  hidden?: boolean;
  label?: string;
  labelKey?: string;
  placeholder?: string;
  placeholderKey?: string;
  name: string;
  rules?: RegisterOptions;
  disabled?: boolean | boolean[];
  className?: string;
  hideLabel?: boolean;
  readonly?: boolean;
  hideError?: boolean;

  /**
   * Use onChange prop if you need more control over input fields
   * (e.g. reset form fields when input changes)
   */
  onChange?: (e?: any) => void;

  /**
   * Use onBlur prop if you need more control over input fields
   * (e.g. perform actions on form fields when input blurs)
   */
  onBlur?: (e?: any) => void;
}

export const FormField = ({
  children,
  name,
  rules,
  onChange,
  onBlur,
  label,
  labelKey,
  className = "",
  placeholder,
  placeholderKey,
  hideLabel = false,
  readonly = false,
  hideError = false,
}: FormFieldProps) => {

  const handleChange = useCallback(
    (rhfOnChange: (...event: any[]) => void) => {
      return (e: any) => {
        rhfOnChange(e);
        onChange?.(e);
      };
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (rhfOnBlur: Noop) => {
      return (e: any) => {
        rhfOnBlur();
        onBlur?.(e);
      };
    },
    [onBlur]
  );

  const labelValue = useMemo(
    () => (labelKey ? (labelKey) : label),
    [label, labelKey]
  );

  const placeholderValue = useMemo(
    () => (placeholderKey ? (placeholderKey) : placeholder),
    [placeholder, placeholderKey]
  );

  const rulesValue = useMemo(() => {
    if (rules?.required === true) {
      return {
        ...rules,
        required: `${labelValue} è obbligatorio`,
      };
    }

    return rules ?? {};
  }, [rules, labelValue]);

  const displayLabel = useMemo(() => {
    if (!labelValue) return labelValue;
    // If rules.required is true we mark as required.
    // Also treat presence of a `validate` function as an indication
    // the field performs a required-like validation (common for selects
    // in this codebase), so show the asterisk to match InputText behavior.
    const hasValidate = typeof rules?.validate === "function";
    return rules?.required === true || hasValidate
      ? `${labelValue}*`
      : labelValue;
  }, [labelValue, rules?.required, rules?.validate]);

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => {
        const isEmpty =
          field.value === null ||
          field.value === undefined ||
          // empty string
          (typeof field.value === "string" && field.value.trim() === "") ||
          // empty array
          (Array.isArray(field.value) && field.value.length === 0) ||
          // numeric zero (common sentinel for "no selection" in taxonomy selects)
          (typeof field.value === "number" && field.value === 0) ||
          // empty plain object
          (typeof field.value === "object" &&
            !Array.isArray(field.value) &&
            Object.keys(field.value || {}).length === 0);

        // Don't render anything when readonly and the value is empty/null/undefined
        if (readonly && isEmpty) return <></>;

        if (React.isValidElement(children)) {
          const hasError = !!fieldState.error && !hideError;
          return (
            <div className={`${styles.formField} ${className}`}>
              {displayLabel && !hideLabel && (
                <label htmlFor={name} className={styles.formFieldLabel}>
                  {displayLabel}
                </label>
              )}
              {React.cloneElement(
                children as React.ReactElement,
                {
                  ...(hasError && { error: hasError }),
                  name: field.name,
                  onBlur: handleBlur(field.onBlur),
                  onChange: handleChange(field.onChange),
                  ref: field.ref,
                  value: field.value,
                  placeholder: placeholderValue,
                  readonly: readonly,
                } as InputConfig
              )}
              <div className={styles.formFieldError}>
                {hideError ? "" : fieldState.error?.message ?? ""}
              </div>
            </div>
          );
        }

        throw new Error("Invalid form input");
      }}
      rules={rulesValue}
    />
  );
};
