import { ColumnDef } from "@tanstack/react-table";
import { TableContextProvider } from "./parts/table-context";
import { TableInner } from "./parts/table-inner";
import { TableActionConfig } from "./table-action-config";
import { PaginationData } from "@/api/paginationData";

type ContainerProps<TData> = {
  pagination?: PaginationData;
  data: TData[] | undefined;
  columns: ColumnDef<TData>[];
  actions?: TableActionConfig<TData>[];
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;
};

export const Table = <TData extends object>({
  pagination = undefined,
  data,
  columns,
  actions = [],
  isLoading = false,
  onRowClick = undefined,
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
      />
    </TableContextProvider>
  );
};
