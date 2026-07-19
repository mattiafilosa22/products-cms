import React, { ChangeEvent, FocusEvent } from "react";
import styles from "./input-text.module.scss";
import { InputConfig } from "../input-config";

interface ContainerProps extends InputConfig {
  placeholder?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | null;
  skinny?: boolean;
  readonly?: boolean;
  maxLength?: number;
}

export const InputText: React.FC<ContainerProps> = ({
  name,
  ref,
  error,
  value = "",
  onChange = null,
  onBlur = null,
  placeholder = undefined,
  icon = null,
  skinny = false,
  readonly = false,
  maxLength = 255,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    onChange?.(val);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;

    onBlur?.(val);
  };

  const Icon = icon;

  return (
    <div className={styles.appInputText}>
      <div
        className={`${styles.inputContainer} ${readonly ? "readonly-field" : ""} ${error ? styles.inputError : ""} ${skinny ? styles.skinny : ""}`}
      >
        <input
          id={name}
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value || ""}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly={readonly}
        />
        {Icon && <Icon className="inputIcon" width={24} height={24} />}
      </div>
    </div>
  );
};
