import { Modal } from "mama";
import { AppButton } from "mama";
import IconPlus from "@/assets/icons/plus.svg";
import { ImportModalInner } from "./import-modal-inner";

export const ImportModal = () => {
  return (
    <Modal
      trigger={
        <AppButton
          onClick={() => {}}
          icon={IconPlus}
          variant="primary"
          label="Importa prodotti"
        />
      }
    >
      <ImportModalInner />
    </Modal>
  );
};
