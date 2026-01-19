import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginationData } from "@/api/paginationData";
import { Table, TableState } from "@/app/_shared/table";
import { GetAllProductsRequest } from "@/api/products/_getAllProducts";
import { getColumns } from "./product-list-table-columns";
import { getActions } from "./product-list-table-actions";
import { useRouter } from "next/navigation";
import { Product } from "@/api/products/_type";

interface ProductListTableProps<TTableOptions extends object> {
  data?: Product[];
  pagination?: PaginationData;
  onOptionsChange: (options: TTableOptions) => void;
  isDataLoading?: boolean;
}

export const ProductListTable = ({
  data = undefined,
  pagination,
  onOptionsChange,
  isDataLoading = false,
}: ProductListTableProps<GetAllProductsRequest>) => {
  // const { deleteProduct, isLoading: isDeletingProduct } = useDeleteProduct();

  const [locationsQueryFilters, setLocationsQueryFilters] =
    useState<GetAllProductsRequest>({
      page: 1,
      limit: 10,
    });

  // Local state to manage data updates after soft delete
  const [localData, setLocalData] = useState<Product[] | undefined>(data);

  // Sync local data with incoming data prop
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const router = useRouter();

  const onRowClick = useCallback(
    (rowData: Product) => {
      router.push("/products/view/" + rowData.id);
    },
    [router],
  );

  const handleEdit = useCallback((event: Product) => {}, []);

  const handleDelete = useCallback((event: Product) => {}, []);

  const columns = useMemo(() => {
    return getColumns();
  }, []);

  const actions = useMemo(() => {
    return getActions(handleEdit, handleDelete);
  }, [handleEdit, handleDelete]);

  return (
    <Table<Product>
      data={localData}
      pagination={pagination}
      columns={columns}
      actions={actions}
      isLoading={isDataLoading}
      onRowClick={onRowClick}
    />
  );
};
