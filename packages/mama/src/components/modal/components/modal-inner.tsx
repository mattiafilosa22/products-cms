import React, { useCallback } from "react";
import style from "./../modal.module.scss";
import { ModalHeader } from "./modal-header";
import { ModalFooter } from "./modal-footer";
import { useModalContext } from "../modal-context";

interface ModalInnerProps {
  children: React.ReactNode;
  size: "sm" | "md" | "lg";
  styleButtons?: "default" | "danger";
}

export const ModalInner: React.FC<ModalInnerProps> = ({
  children,
  size,
  styleButtons = "default",
}) => {
  const { tryClose } = useModalContext();

  const onCloseClick = useCallback(() => {
    tryClose(true);
  }, [tryClose]);

  return (
    <div className={style.modalWrapper}>
      <div onClick={() => onCloseClick()} className={style.modalBackdrop}></div>

      <div className={`${style.modal} ${style[size]}`}>
        <ModalHeader />

        <div className={style.modalContent}>{children}</div>

        <ModalFooter styleButtons={styleButtons} />
      </div>
    </div>
  );
};
