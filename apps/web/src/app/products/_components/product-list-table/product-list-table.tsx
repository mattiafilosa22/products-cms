import { useCallback, useMemo } from "react";
import { PaginationData, Table, TableState } from "mama";
import { useRouter } from "next/navigation";
import { Product } from "@/api/products/_type";
import { useDeleteProductMutation } from "@/api/products/_useDeleteProductMutation";
import type { ProductsQueryParams } from "@/api/products/_useProductsQuery";
import { getColumns } from "./product-list-table-columns";
import { getActions } from "./product-list-table-actions";

const DEFAULT_LIMIT = 10;

interface ProductListTableProps {
  data?: Product[];
  pagination?: PaginationData;
  onOptionsChange: (options: ProductsQueryParams) => void;
  isDataLoading?: boolean;
}

export const ProductListTable = ({
  data,
  pagination,
  onOptionsChange,
  isDataLoading = false,
}: ProductListTableProps) => {
  const router = useRouter();
  const deleteProductMutation = useDeleteProductMutation();

  const onRowClick = useCallback(
    (rowData: Product) => {
      router.push(`/products/view/${rowData.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (rowData: Product) => {
      router.push(`/products/edit/${rowData.id}`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (rowData: Product) => {
      try {
        await deleteProductMutation.mutateAsync(rowData.id);
      } catch {
        // Failure is already surfaced via the mutation's onError toast.
      }
    },
    [deleteProductMutation],
  );

  const handleStateChange = useCallback(
    (state: TableState) => {
      onOptionsChange({
        page: state.page + 1,
        limit: pagination?.limit ?? DEFAULT_LIMIT,
      });
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
      data={data}
      pagination={pagination}
      columns={columns}
      actions={actions}
      isLoading={isDataLoading}
      onRowClick={onRowClick}
      onStateChange={handleStateChange}
    />
  );
};
