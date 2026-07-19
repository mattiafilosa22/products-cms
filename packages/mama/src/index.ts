// Entry point pubblico della UI library mama.

// Componenti base
export { AppButton } from "./components/app-button/app-button";
export { Loader } from "./components/loader/loader";
export type { LoaderProps } from "./components/loader/loader";

// Modal (compound component + context)
export { Modal } from "./components/modal/modal";
export {
  ModalProvider,
  useModalContext,
} from "./components/modal/modal-context";
export type { ModalResult } from "./components/modal/modal-result";

// Form
export { Form } from "./components/forms/form/form";
export type { FormProps } from "./components/forms/form/form";
export { FormField } from "./components/forms/form-field/form-field";
export type {
  FieldRenderProps,
  FormFieldProps,
} from "./components/forms/form-field/form-field";
export type { InputConfig } from "./components/forms/input-config";
export { InputText } from "./components/forms/input-text/input-text";
export { InputPrice } from "./components/forms/input-price/input-price";
export { InputFile } from "./components/forms/input-file/input-file";
export { TextArea } from "./components/forms/textarea/textarea";

// Table
export { Table } from "./table/table";
export type { TableState } from "./table/table-state";
export type { TableActionConfig } from "./table/table-action-config";
export type { PaginationData } from "./table/pagination-data";

// Tipi condivisi
export type { BaseAction, SelectOption } from "./types/global";
