import React, { useCallback, useEffect, useId, useRef } from "react";
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
  const { title, tryClose } = useModalContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Native <dialog> gives focus trap, Esc, ::backdrop and inert for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    // Every close path unmounts the portal; removing an open dialog from the
    // DOM skips the native "close the dialog" steps, so focus would NOT be
    // restored to the trigger. Closing in the cleanup (while the node is
    // still in the document) runs those steps, including the focus restore.
    // Not verifiable under the jsdom polyfill — covered by manual testing.
    return () => dialog?.close();
  }, []);

  // Esc fires the native "cancel" event: prevent the UA close (React owns the
  // mount) and close through the context with a dismissal result.
  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      tryClose(false);
    },
    [tryClose],
  );

  // Clicks on ::backdrop are dispatched on the <dialog> element itself; the
  // inner wrapper covers the whole dialog surface, so target === dialog means
  // the click landed on the backdrop.
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) tryClose(false);
    },
    [tryClose],
  );

  return (
    <dialog
      ref={dialogRef}
      className={`${style.modal} ${style[size]}`}
      aria-labelledby={title ? titleId : undefined}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={style.modalInner}>
        <ModalHeader titleId={titleId} />

        <div className={style.modalContent}>{children}</div>

        <ModalFooter styleButtons={styleButtons} />
      </div>
    </dialog>
  );
};
