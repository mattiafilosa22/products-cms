import React from "react";
import Cross from "../../../assets/icons/cross.svg";
import style from "../modal.module.scss";
import { AppButton } from "../../app-button/app-button";
import { useModalContext } from "../modal-context";

interface ModalHeaderProps {}

export const ModalHeader = ({}: ModalHeaderProps) => {
  const { title, titleIcon, tryClose } = useModalContext();

  return (
    <div className={style.modalHeader}>
      {titleIcon}
      {title && <div className={style.modalTitle}>{title}</div>}
      {titleIcon && <div className={style.modalTitleIcon}>{titleIcon}</div>}

      <AppButton
        onClick={() => tryClose()}
        className={style.modalClose}
        style="link"
        variant="neutral"
        size="icon"
        icon={Cross}
      />
    </div>
  );
};
