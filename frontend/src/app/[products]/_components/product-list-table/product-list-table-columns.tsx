import { Product } from "@/api/products/_type";
import { ColumnDef } from "@tanstack/react-table";

export const getColumns = () => {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: () => "Nome",
      cell: (props) => props.row.original.name,
    },
    {
      accessorKey: "description",
      header: () => "Descrizione",
      cell: (props) => props.row.original.description,
    },
    {
      accessorKey: "price",
      header: () => "Prezzo",
      cell: (props) => {
        const price = props.row.original.price;
        return price ? `${price} €` : "N/A";
      },
    },
    {
      accessorKey: "discountPrice",
      header: () => "Prezzo scontato",
      cell: (props) => {
        const discountPrice = props.row.original.discountPrice;
        return discountPrice ? `${discountPrice} €` : "N/A";
      },
    },
  ];

  return columns;
};
