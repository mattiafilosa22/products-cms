import { Product } from "@/api/products/_type";
import { ColumnDef } from "@tanstack/react-table";
import styles from "./product-list-table-columns.module.scss";

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
        const { price, discountPrice } = props.row.original;

        if (discountPrice != null) {
          return (
            <div className={styles.priceWrapper}>
              <span className={styles.discountPrice}>{discountPrice} €</span>
              <span className={styles.originalPrice}>{price} €</span>
            </div>
          );
        }

        return price ? `${price} €` : "N/A";
      },
    },
  ];

  return columns;
};
