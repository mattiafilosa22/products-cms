"use client";

import React, { useCallback, useMemo } from "react";
import {
  Controller,
  Noop,
  RefCallBack,
  RegisterOptions,
} from "react-hook-form";
import styles from "./form-field.module.scss";

// Contract passed to the render prop: the compiler verifies the input
// component accepts these props (no more cloneElement + runtime cast).
export interface FieldRenderProps<TValue> {
  name: string;
  value: TValue;
  // RHF change handlers accept either a DOM event or a plain value.
  onChange: (eventOrValue: unknown) => void;
  onBlur: () => void;
  ref: RefCallBack;
  error: boolean;
  placeholder?: string;
  readonly?: boolean;
}

export interface FormFieldProps<TValue = unknown> {
  render: (field: FieldRenderProps<TValue>) => React.ReactElement;
  label?: string;
  labelKey?: string;
  placeholder?: string;
  placeholderKey?: string;
  name: string;
  rules?: RegisterOptions;
  className?: string;
  hideLabel?: boolean;
  readonly?: boolean;
  hideError?: boolean;

  /**
   * Use onChange prop if you need more control over input fields
   * (e.g. reset form fields when input changes)
   */
  onChange?: (eventOrValue?: unknown) => void;

  /**
   * Use onBlur prop if you need more control over input fields
   * (e.g. perform actions on form fields when input blurs)
   */
  onBlur?: () => void;
}

const isEmptyValue = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  // empty string
  (typeof value === "string" && value.trim() === "") ||
  // empty array
  (Array.isArray(value) && value.length === 0) ||
  // empty plain object (numeric 0 is NOT empty: a readonly field holding 0
  // must render)
  (typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0);

export const FormField = <TValue = unknown,>({
  render,
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
}: FormFieldProps<TValue>) => {
  const handleChange = useCallback(
    (rhfOnChange: (eventOrValue: unknown) => void) =>
      (eventOrValue: unknown) => {
        rhfOnChange(eventOrValue);
        onChange?.(eventOrValue);
      },
    [onChange],
  );

  const handleBlur = useCallback(
    (rhfOnBlur: Noop) => () => {
      rhfOnBlur();
      onBlur?.();
    },
    [onBlur],
  );

  const labelValue = useMemo(
    () => (labelKey ? labelKey : label),
    [label, labelKey],
  );

  const placeholderValue = useMemo(
    () => (placeholderKey ? placeholderKey : placeholder),
    [placeholder, placeholderKey],
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
      rules={rulesValue}
      render={({ field, fieldState }) => {
        // Don't render anything when readonly and the value is empty
        if (readonly && isEmptyValue(field.value)) return <></>;

        const hasError = !!fieldState.error && !hideError;

        return (
          <div className={`${styles.formField} ${className}`}>
            {displayLabel && !hideLabel && (
              <label htmlFor={name} className={styles.formFieldLabel}>
                {displayLabel}
              </label>
            )}
            {render({
              name: field.name,
              value: field.value,
              onChange: handleChange(field.onChange),
              onBlur: handleBlur(field.onBlur),
              ref: field.ref,
              error: hasError,
              placeholder: placeholderValue,
              readonly,
            })}
            <div className={styles.formFieldError}>
              {hideError ? "" : (fieldState.error?.message ?? "")}
            </div>
          </div>
        );
      }}
    />
  );
};
