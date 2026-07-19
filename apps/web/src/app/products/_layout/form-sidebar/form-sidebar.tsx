import React from "react";
import styles from "./form-sidebar.module.scss";
import { AppButton } from "mama";
import { DeleteProductButton } from "@/app/products/edit/[id]/_components/delete-product-button";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

interface FormSidebarProps {
  onDelete?: () => Promise<void>;
  isLoadingSave?: boolean;
  isLoadingDelete?: boolean;
  isEdit?: boolean;
  readonly?: boolean;
  editUrl?: string;
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
  onDelete,
  isLoadingSave = false,
  isLoadingDelete = false,
  isEdit = false,
  readonly = false,
  editUrl,
}) => {
  const router = useRouter();
  const formContext = useFormContext();
  const isDirty = formContext ? formContext.formState.isDirty : false;

  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Azioni</h3>
        <div className={styles.actions}>
          {readonly ? (
            <AppButton
              label="Modifica"
              className="w-100"
              onClick={() => editUrl && router.push(editUrl)}
            />
          ) : (
            <>
              <AppButton
                type="submit"
                form="product-form"
                loading={isLoadingSave}
                label="Salva"
                className="w-100"
                disabled={!isDirty}
              />
              {isEdit && onDelete && (
                <DeleteProductButton
                  onDelete={onDelete}
                  isLoading={isLoadingDelete}
                  className="mt-4"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
