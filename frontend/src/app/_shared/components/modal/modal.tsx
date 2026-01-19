import React, { JSX } from "react";
import "reactjs-popup/dist/index.css";
import { ModalProvider } from "./modal-context";
import { ModalInner } from "./components/modal-inner";
import { createPortal } from "react-dom";
import { ModalResult } from "./modal-result";

interface ModalProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  size?: "sm" | "md" | "lg";
  style?: "default" | "danger";
  onClose?: (result: ModalResult) => void; // Optional callback when the modal is closed
}

export const Modal: React.FC<ModalProps> = ({
  children,
  trigger,
  size = "md",
  style = "default",
  onClose,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const modalRoot = document.getElementById('modal-root') ?? document.body;

  const handleTriggerClick = () => {
    setIsOpen(true);
  };

  const closeModal = (result: ModalResult) => {
    setIsOpen(false);
    onClose?.(result);
  }

  // If a trigger is provided, clone it to add the onClick handler
  const clonedTrigger = React.cloneElement(trigger as JSX.Element, {
    onClick: handleTriggerClick,
  });

  return (
    <>
      {clonedTrigger}
      {isOpen && createPortal(
        <ModalProvider closeModal={closeModal}>
          <ModalInner size={size} styleButtons={style}>
            {children}
          </ModalInner>
        </ModalProvider>,
        modalRoot
      )}
    </>
  );
};
