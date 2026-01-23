import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginationData } from "@/api/paginationData";
import { Table, TableState } from "@/app/_shared/table";
import { GetAllProductsRequest } from "@/api/products/_getAllProducts";
import { getColumns } from "./product-list-table-columns";
import { getActions } from "./product-list-table-actions";
import { useRouter } from "next/navigation";
import { Product } from "@/api/products/_type";
import { useDeleteProduct } from "@/api/products/_deleteProduct";

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
  const {
    deleteProduct,
    isLoading: isDeletingProduct,
    error,
  } = useDeleteProduct();

  // Local state to manage data updates after soft delete
  const [localData, setLocalData] = useState<Product[] | undefined>(data);

  // Sync local data with incoming data prop
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const router = useRouter();

  const onRowClick = useCallback(
    (rowData: Product) => {
      router.push(`/products/view/${rowData.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (event: Product) => {
      router.push(`/products/edit/${event.id}`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (event: Product) => {
      const response = await deleteProduct(event.id);
      if (response) {
        onOptionsChange({
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
        } as any);
      }
    },
    [deleteProduct, onOptionsChange, pagination],
  );

  const handleStateChange = useCallback(
    (state: TableState) => {
      onOptionsChange({
        page: state.page + 1,
        limit: pagination?.limit || 10,
      } as any);
    },
    [onOptionsChange, pagination?.limit],
  );

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
      onStateChange={handleStateChange}
    />
  );
};
