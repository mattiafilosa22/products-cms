import React, { ChangeEvent, FocusEvent } from "react";
import styles from "./textarea.module.scss";
import { InputConfig } from "../input-config";

interface ContainerProps extends InputConfig {
  readonly?: boolean;
  resize?: boolean;
  rows?: number;
  cols?: number;
  maxlength?: number;
}

export const TextArea: React.FC<ContainerProps> = ({
  name,
  placeholder,
  ref,
  error,
  value = "",
  onChange = null,
  onBlur = null,
  resize = false,
  readonly = false,
  rows = 8,
  cols = 50,
  maxlength = 2000,
}) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    onChange?.(val);
  }

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    onBlur?.(val);
  }

  return (
    <div className={`${styles.appTextArea} ${resize ? "resize" : ""} ${readonly ? "readonly-field" : ""} ${error ? styles.inputError : ""}`}>
      <textarea
        id={name}
        placeholder={placeholder}
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={readonly}
        rows={rows}
        cols={cols}
        maxLength={maxlength}
      />
    </div>
  );
};
