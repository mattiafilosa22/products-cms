"use client";

import { AppButton, Modal, useModalContext } from "@/app/_shared/components";
import { useEffect } from "react";

interface DeleteProductButtonProps {
  onDelete: () => Promise<void>;
  isLoading: boolean;
  className?: string;
}

const DeleteModalContent = ({
  onDelete,
}: {
  onDelete: () => Promise<void>;
}) => {
  const { setTitle, setConfirmConfig, tryClose } = useModalContext();

  useEffect(() => {
    setTitle("Elimina prodotto");

    setConfirmConfig({
      onClick: async () => {
        await onDelete();
        tryClose(true);
      },
    });
  }, [setTitle, setConfirmConfig, tryClose, onDelete]);

  return <p>Sei sicuro di voler cancellare?</p>;
};

export const DeleteProductButton = ({
  onDelete,
  isLoading,
  className = "mt-4",
}: DeleteProductButtonProps) => {
  const trigger = (
    <AppButton variant="danger" className={className} loading={isLoading}>
      Cancella
    </AppButton>
  );

  return (
    <Modal trigger={trigger} style="danger">
      <DeleteModalContent onDelete={onDelete} />
    </Modal>
  );
};
