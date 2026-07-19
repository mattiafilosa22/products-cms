import React, { use, useMemo } from "react";
import style from "../modal.module.scss";
import { AppButton } from "../../app-button/app-button";
import { useModalContext } from "../modal-context";

interface ModalFooterProps {
  styleButtons?: "default" | "danger";
}

export const ModalFooter = ({
  styleButtons = "default"
}: ModalFooterProps) => {
  const { cancelConfig, confirmConfig, tryClose } = useModalContext();

  const handleCancelClick = () => {
    if (cancelConfig?.onClick) {
      cancelConfig.onClick();
      return;
    }

    tryClose();
  }

  const handleConfirmClick = () => {
    confirmConfig?.onClick?.();
  }

  const cancelLabel = useMemo(() =>
    cancelConfig?.labelKey ? cancelConfig.labelKey : cancelConfig?.label
  , [cancelConfig]);
  const confirmLabel = useMemo(() =>
    confirmConfig?.labelKey ? confirmConfig.labelKey : confirmConfig?.label
  , [confirmConfig]);

  return (
    <div className={style.modalFooter}>
      <AppButton
        style="outlined"
        variant={styleButtons === "danger" ? "danger" : "primary"}
        onClick={handleCancelClick}
        label={cancelLabel}
        loading={cancelConfig?.loading ?? false}
        disabled={cancelConfig?.disabled ?? false}
        size="md"
      />

      <AppButton
        style="filled"
        variant={styleButtons === "danger" ? "danger" : "primary"}
        onClick={handleConfirmClick}
        label={confirmLabel}
        loading={confirmConfig?.loading ?? false}
        disabled={confirmConfig?.disabled ?? false}
        size="md"
      />
    </div>
  );
};
