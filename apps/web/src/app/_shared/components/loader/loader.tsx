import React from "react";
import styles from "./loader.module.scss";
import IconLoading from "@/assets/loading.svg";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  overlay?: boolean;
  className?: string;
  progress?: number; // 0-100
  showProgress?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  text,
  overlay = false,
  className = "",
  progress = 0,
  showProgress = false,
}) => {
  const iconSizes = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  const iconSize = iconSizes[size];
  const displayText = text;
  const progressText = showProgress ? `${Math.round(progress)}%` : displayText;

  const loaderContent = (
    <div className={`${styles.loaderContent} ${styles[size]} ${className}`}>
      {showProgress ? (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          {progressText && (
            <div className={styles.loaderText}>{progressText}</div>
          )}
        </div>
      ) : (
        <>
          <IconLoading width={iconSize} height={iconSize} />
          {displayText && (
            <div className={styles.loaderText}>{displayText}</div>
          )}
        </>
      )}
    </div>
  );

  if (overlay) {
    return <div className={styles.loaderOverlay}>{loaderContent}</div>;
  }

  return loaderContent;
};
