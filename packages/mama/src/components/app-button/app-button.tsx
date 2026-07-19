import React, { useMemo } from "react";
import styles from "./app-button.module.scss";
import { BaseAction } from "../../types/global";

type AppButtonProps = BaseAction & {
  variant?:
    | "primary"
    | "danger"
    | "neutral"
    | "white"
    | "custom"
    | "outline"
    | "dashed"
    | "empty";
  style?: "filled" | "outlined" | "link" | "underline" | "bin";
  size?: "sm" | "md" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  form?: string;
};

export const AppButton: React.FC<React.PropsWithChildren<AppButtonProps>> = ({
  label = "",
  children,
  icon = null,
  variant = "primary",
  style = "filled",
  size = "lg",
  type = "button",
  loading = false,
  disabled = false,
  onClick = undefined,
  className = "",
  form = undefined,
}) => {
  const Icon = icon;

  const combinedClassName =
    variant === "custom"
      ? `${className}`
      : `${styles.appButton} ${styles[variant]} ${styles[style]} ${styles[size]} ${loading ? styles.loading : ""} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick();
  };

  const labelValue = children || label;

  return (
    <button
      type={type}
      form={form}
      className={combinedClassName}
      disabled={disabled}
      onClick={handleClick}
    >
      {Icon && <Icon width={24} height={24} />} {size !== "icon" && labelValue}
    </button>
  );
};
