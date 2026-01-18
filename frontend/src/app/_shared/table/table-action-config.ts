type BaseAction = {
  label?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | null;
  onClick?: () => void;
}

export type TableActionConfig<T> = BaseAction & {
  key: string;
  modalContent?: (rowData: T) => React.ReactNode;
  modalContentTitle?: string;
  modalContentBody?: string;
  reloadAfterModalConfirm?: boolean;
  action?: (rowData: T) => void;
  type: "primary" | "secondary";
  variant?: "primary" | "danger" | "neutral" | "custom";
  style?: "filled" | "outlined" | "link";
  disabled?: (rowData: T) => boolean;
}
