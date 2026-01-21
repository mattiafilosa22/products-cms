import { useModalContext } from "@/app/_shared/components/modal/modal-context";
import { useImportProduct } from "@/api/products/_importProduct";
import { useEffect, useState } from "react";
import styles from "./import-modal.module.scss";
import { InputFile } from "@/app/_shared/components/forms/input-file/input-file";

export const ImportModalInner = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { setTitle, setConfirmConfig, tryClose } = useModalContext();
  const { importProduct, isLoading } = useImportProduct();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setTitle("Importa prodotti da CSV");
  }, [setTitle]);

  const handleImport = async () => {
    console.log("file", file);
    if (!file) return;

    const result = await importProduct(file);
    if (result) {
      onSuccess?.();
      tryClose();
    }
  };

  useEffect(() => {
    setConfirmConfig({
      label: "Importa",
      disabled: !file || isLoading,
      loading: isLoading,
      onClick: handleImport,
    });
  }, [file, isLoading, setConfirmConfig]);

  return (
    <div className={styles.importModal}>
      <InputFile
        onFileChange={(selectedFile: File | null) => {
          // console.log("selectedFile", selectedFile);
          setFile(selectedFile);
        }}
      />
    </div>
  );
};
