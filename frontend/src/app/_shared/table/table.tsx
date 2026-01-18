import { ColumnDef } from "@tanstack/react-table";
import { TableContextProvider } from "./parts/table-context";
import { TableInner } from "./parts/table-inner";
import { TableState } from "./table-state";
import { TableActionConfig } from "./table-action-config";
import { PaginationData } from "@/api/paginationData";

type ContainerProps<TData> = {
  pagination?: PaginationData;
  data: TData[] | undefined;
  columns: ColumnDef<TData>[];
  actions?: TableActionConfig<TData>[];
  searchText?: string;
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;
  onChangeTableFilters?: (tableState: TableState) => void;
};

export const Table = <TData extends object>({
  pagination = undefined,
  data,
  columns,
  actions = [],
  searchText,
  isLoading = false,
  onRowClick = undefined,
  onChangeTableFilters,
}: ContainerProps<TData>) => {
  return (
    <TableContextProvider onChangeTableFilters={onChangeTableFilters}>
      <TableInner<TData>
        pagination={pagination}
        data={data ?? []}
        columns={columns}
        actions={actions}
        searchText={searchText}
        isLoading={isLoading || data === undefined}
        onRowClick={onRowClick}
      />
    </TableContextProvider>
  );
};
