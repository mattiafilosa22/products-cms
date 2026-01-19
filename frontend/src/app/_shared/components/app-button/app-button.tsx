import React, { useMemo } from "react";
import styles from "./app-button.module.scss";
import { BaseAction } from "@/app/_shared/types/global";

type AppButtonProps = BaseAction & {
  variant?: "primary" | "danger" | "neutral" | "white" | "custom" | "outline" | "dashed" | "empty";
  style?: "filled" | "outlined" | "link" | "underline" | "bin";
  size?: "sm" | "md" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label = "",
  icon = null,
  variant = "primary",
  style = "filled",
  size = "lg",
  type = "button",
  loading = false,
  disabled = false,
  onClick = undefined,
  className = "",
}) => {

  const Icon = icon;

  const combinedClassName = variant === "custom" ?
    `${className}` :
    `${styles.appButton} ${styles[variant]} ${styles[style]} ${styles[size]} ${loading ? styles.loading : ""} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick();
  };

  const labelValue = useMemo(
    () => label,
    [label]
  );

  return (
    <button type={type}
      className={combinedClassName}
      title={labelValue}
      disabled={disabled}
      onClick={handleClick}>
      {Icon && <Icon width={24} height={24} />} {size !== "icon" && labelValue}
    </button>
  );
};
