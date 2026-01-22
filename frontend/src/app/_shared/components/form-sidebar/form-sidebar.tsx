import React from "react";
import styles from "./form-sidebar.module.scss";
import { AppButton } from "@/app/_shared/components";
import { DeleteProductButton } from "@/app/[products]/edit/[id]/_components/delete-product-button";

interface FormSidebarProps {
  onSave: () => void;
  onDelete: () => Promise<void>;
  isLoadingSave: boolean;
  isLoadingDelete: boolean;
  isEdit?: boolean;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
  onSave,
  onDelete,
  isLoadingSave,
  isLoadingDelete,
  isEdit = false,
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Azioni</h3>
        <div className={styles.actions}>
          <AppButton
            type="submit"
            form="product-form"
            loading={isLoadingSave}
            label="Salva Modifiche"
            className="w-100"
          />
          {isEdit && (
            <DeleteProductButton
              onDelete={onDelete}
              isLoading={isLoadingDelete}
              className=""
            />
          )}
        </div>
      </div>
    </div>
  );
};
