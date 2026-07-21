import { useModalContext } from "mama";
import { toast } from "react-toastify";
import { useImportProductsMutation } from "@/api/products/_useImportProductsMutation";
import { useEffect, useState } from "react";
import styles from "./import-modal.module.scss";
import { InputFile } from "mama";

export const ImportModalInner = () => {
  const { setTitle, setConfirmConfig, tryClose } = useModalContext();
  const importProductsMutation = useImportProductsMutation();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setTitle("Importa prodotti da CSV");
  }, [setTitle]);

  const handleImport = async () => {
    if (!file) return;

    try {
      await importProductsMutation.mutateAsync(file);
      tryClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setConfirmConfig({
      label: "Importa",
      disabled: !file || importProductsMutation.isPending,
      loading: importProductsMutation.isPending,
      onClick: handleImport,
    });
  }, [file, importProductsMutation.isPending, setConfirmConfig]);

  return (
    <div className={styles.importModal}>
      <InputFile
        onFileChange={(selectedFile: File | null) => {
          setFile(selectedFile);
        }}
        onFileError={(message) => toast.error(message)}
      />
    </div>
  );
};
