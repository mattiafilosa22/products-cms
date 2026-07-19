import IconEdit from "@/assets/icons/edit.svg";
import IconBin from "@/assets/icons/bin.svg";
import { TableActionConfig } from "mama";
import { Product } from "@/api/products/_type";

export const getActions = (
  handleEdit: (event: Product) => void,
  handleDelete: (event: Product) => void,
): TableActionConfig<Product>[] => {
  return [
    {
      key: "edit",
      label: "Common.action_edit",
      icon: IconEdit,
      action: handleEdit,
      type: "primary",
      variant: "neutral",
      style: "link",
    },
    {
      key: "delete",
      label: "Common.action_delete",
      modalContentTitle: "Elimina",
      modalContentBody: "Sei sicuro di voler eliminare questo prodotto?",
      icon: IconBin,
      action: handleDelete,
      type: "secondary",
      variant: "danger",
      style: "link",
    },
  ];
};
