import React from "react";
import Cross from "../../../assets/icons/cross.svg";
import style from "../modal.module.scss";
import { AppButton } from "../../app-button/app-button";
import { useModalContext } from "../modal-context";

interface ModalHeaderProps {
  // Id referenced by the dialog's aria-labelledby.
  titleId?: string;
}

export const ModalHeader = ({ titleId }: ModalHeaderProps) => {
  const { title, titleIcon, tryClose } = useModalContext();

  return (
    <div className={style.modalHeader}>
      {titleIcon}
      {title && (
        <div id={titleId} className={style.modalTitle}>
          {title}
        </div>
      )}
      {titleIcon && <div className={style.modalTitleIcon}>{titleIcon}</div>}

      <AppButton
        onClick={() => tryClose(false)}
        className={style.modalClose}
        style="link"
        variant="neutral"
        size="icon"
        icon={Cross}
      />
    </div>
  );
};
