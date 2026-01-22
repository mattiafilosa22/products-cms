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
    setTitle("Common.action_delete");

    setConfirmConfig({
      onClick: async () => {
        await onDelete();
        tryClose(true);
      },
    });
  }, [setTitle, setConfirmConfig, tryClose, onDelete]);

  return <p>Common.modal_delete_content</p>;
};

export const DeleteProductButton = ({
  onDelete,
  isLoading,
  className = "mt-4",
}: DeleteProductButtonProps) => {
  const trigger = (
    <AppButton variant="danger" className={className} loading={isLoading}>
      Delete
    </AppButton>
  );

  return (
    <Modal trigger={trigger} style="danger">
      <DeleteModalContent onDelete={onDelete} />
    </Modal>
  );
};
