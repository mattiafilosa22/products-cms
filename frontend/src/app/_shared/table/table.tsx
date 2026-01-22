import { ColumnDef } from "@tanstack/react-table";
import { TableContextProvider } from "./parts/table-context";
import { TableInner } from "./parts/table-inner";
import { TableActionConfig } from "./table-action-config";
import { PaginationData } from "@/api/paginationData";
import { TableState } from "./table-state";

type ContainerProps<TData> = {
  pagination?: PaginationData;
  data: TData[] | undefined;
  columns: ColumnDef<TData>[];
  actions?: TableActionConfig<TData>[];
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;
  onStateChange?: (state: TableState) => void;
};

export const Table = <TData extends object>({
  pagination = undefined,
  data,
  columns,
  actions = [],
  isLoading = false,
  onRowClick = undefined,
  onStateChange = undefined,
}: ContainerProps<TData>) => {
  return (
    <TableContextProvider>
      <TableInner<TData>
        pagination={pagination}
        data={data ?? []}
        columns={columns}
        actions={actions}
        isLoading={isLoading || data === undefined}
        onRowClick={onRowClick}
        onStateChange={onStateChange}
      />
    </TableContextProvider>
  );
};
