"use client";

import { PropsWithChildren, ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ModalResult } from "./modal-result";

interface ModalProviderProps extends PropsWithChildren {
  // closeModal function passed from Modal component to allow closing the modal from context
  closeModal: (result: ModalResult) => void;
}

interface ButtonConfig {
  label?: string;
  labelKey?: string;
  disabled: boolean;
  loading: boolean;
  onClick: (() => void) | null;
}

interface ModalContextInterface {
  cancelConfig: ButtonConfig;
  setCancelConfig: (config: Partial<ButtonConfig>) => void;
  confirmConfig: ButtonConfig;
  setConfirmConfig: (config: Partial<ButtonConfig>) => void;
  title: string | undefined;
  titleIcon: ReactNode | undefined;
  setTitle: (title: string | undefined, icon?: ReactNode) => void;
  tryClose: (result?: ModalResult) => void;
}

const ModalContext = createContext<ModalContextInterface | undefined>(
  undefined,
);

export function useModalContext(): ModalContextInterface {
  const context = useContext(ModalContext);
  if (!context) throw new Error("No ModalProvider in context");
  return context;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  closeModal,
}) => {
  const defaultCancelButton = {
    label: "Annulla",
    disabled: false,
    loading: false,
    onClick: null,
  };
  const defaultConfirmButton = {
    label: "Conferma",
    disabled: false,
    loading: false,
    onClick: null,
  };

  const [cancelButtonState, setCancelButtonState] =
    useState<ButtonConfig>(defaultCancelButton);
  const [confirmButtonState, setConfirmButtonState] =
    useState<ButtonConfig>(defaultConfirmButton);
  const [titleState, setTitleState] = useState<string | undefined>(undefined);
  const [titleIconState, setTitleIconState] = useState<ReactNode>(undefined);

  // Use functional updates and stable callbacks to avoid recreating setter
  // functions on every render. This prevents consumers that call the
  // setters inside effects from causing infinite rerender loops.
  const setCancelConfig = useCallback((config: Partial<ButtonConfig>) => {
    setCancelButtonState((prev) => ({
      ...prev,
      ...config,
    }));
  }, []);

  const setConfirmConfig = useCallback((config: Partial<ButtonConfig>) => {
    setConfirmButtonState((prev) => ({
      ...prev,
      ...config,
    }));
  }, []);

  const setTitle = useCallback(
    (title: string | undefined, icon?: ReactNode) => {
      setTitleState(title);
      setTitleIconState(icon);
    },
    [],
  );

  const tryClose = useCallback(
    (result: ModalResult | undefined = true) => {
      closeModal(result);
    },
    [closeModal],
  );

  const context: ModalContextInterface = useMemo(
    () => ({
      cancelConfig: cancelButtonState,
      setCancelConfig,
      confirmConfig: confirmButtonState,
      setConfirmConfig,
      title: titleState,
      titleIcon: titleIconState,
      setTitle,
      tryClose,
    }),
    [
      cancelButtonState,
      confirmButtonState,
      titleState,
      titleIconState,
      setCancelConfig,
      setConfirmConfig,
      setTitle,
      tryClose,
    ],
  );

  return (
    <ModalContext.Provider value={context}>{children}</ModalContext.Provider>
  );
};
