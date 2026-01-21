import { Modal } from "@/app/_shared/components";
import { AppButton } from "@/app/_shared/components/app-button/app-button";
import IconPlus from "@/assets/icons/plus.svg";
import { InputFile } from "@/app/_shared/components/input-file/input-file";
import styles from "./import-modal.module.scss";

export const ImportModal = () => {
  return (
    <Modal
      trigger={
        <AppButton
          onClick={() => {}}
          icon={IconPlus}
          variant="primary"
          label="Aggiungi un prodotto"
        />
      }
    >
      <div className={styles.importModal}>
        <InputFile
          onFileChange={function (file: File | null): void {
            // TODO: handle file selection or removal
          }}
        />
      </div>
    </Modal>
  );
};
