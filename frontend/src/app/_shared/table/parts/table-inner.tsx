import {
  ColumnDef,
  TableOptions,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { PaginationData } from "@/api/paginationData";
import { useTableContext } from "./table-context";
import { TablePagination } from "./table-pagination";
import style from "../table.module.scss";
import IconLoading from "@/assets/loading.svg";
import IconCaretUp from "@/assets/icons/caret-up.svg";
import IconCaretDown from "@/assets/icons/caret-down.svg";
import { TableActionConfig } from "../table-action-config";
import { AppButton, Modal } from "@/app/_shared/components";
import { ModalResult } from "@/app/_shared/components/modal/modal-result";

type ContainerProps<TData> = {
  pagination?: PaginationData;
  data: TData[];
  columns: ColumnDef<TData>[];
  actions: TableActionConfig<TData>[];
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;
};

export function TableInner<TData extends object>({
  pagination = undefined,
  data = [],
  columns,
  actions,
  isLoading = false,
  onRowClick = undefined,
}: ContainerProps<TData>) {
  const { changeTableState, tableState } = useTableContext();

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updaterOrValue) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      changeTableState((prev: any) => {
        const newSorting =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev.rawSorting ?? [])
            : updaterOrValue;
        return { ...prev, rawSorting: newSorting };
      });
    },
    [changeTableState],
  );

  const tableConfig: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: {
      sorting: tableState.rawSorting ?? [],
    },
    onSortingChange,
  };

  const [primaryActionsState, setPrimaryActionsState] = useState<
    TableActionConfig<TData>[]
  >([]);
  const [secondaryActionsState, setSecondaryActionsState] = useState<
    TableActionConfig<TData>[]
  >([]);

  const table = useReactTable({ ...tableConfig });

  const handlePageChange = useCallback(
    (selected: number) => {
      changeTableState((prev) => ({ ...prev, page: selected }));
    },
    [changeTableState],
  );

  useEffect(() => {
    setPrimaryActionsState(actions.filter((a) => a.type === "primary"));
    setSecondaryActionsState(actions.filter((a) => a.type === "secondary"));
  }, [actions]);

  const onActionModalClosed = useCallback(
    (result: ModalResult, action: TableActionConfig<TData>) => {
      const reloadAfterConfirm = action.reloadAfterModalConfirm ?? true;
      if (result && reloadAfterConfirm) {
        // Reload Data
        changeTableState((prev) => ({ ...prev }));
      }
    },
    [changeTableState],
  );

  const getActionButton = useCallback(
    (
      action: TableActionConfig<TData>,
      rowData: TData,
      index: number,
      size: "md" | "icon",
    ) => {
      const button = (
        <AppButton
          key={index}
          icon={action.icon}
          style={action.style ?? "link"}
          variant={action.variant ?? "neutral"}
          size={size}
          disabled={action.disabled?.(rowData) ?? false}
          onClick={() => {
            action.action?.(rowData);
          }}
        />
      );

      if (action.modalContent) {
        return (
          <Modal
            key={`modal-${index}`}
            trigger={button}
            onClose={(result) => onActionModalClosed(result, action)}
          >
            {action.modalContent(rowData)}
          </Modal>
        );
      }

      return button;
    },
    [onActionModalClosed],
  );

  return (
    <div className={style.table}>
      <div className={style.tableWrapper}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div
                      className="th-wrapper"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {{
                        asc: <IconCaretUp />,
                        desc: <IconCaretDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && <th></th>}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
                className={`${onRowClick ? "clickable" : ""}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cell.column.id}>
                    <span>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </span>
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="actions-wrapper">
                    <div
                      className="actions"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      {primaryActionsState.map((action, index) =>
                        getActionButton(action, row.original, index, "icon"),
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <TablePagination
          pageCount={Math.ceil(pagination.total / pagination.limit)}
          selectedPage={pagination.page}
          onPageChange={handlePageChange}
        />
      )}

      {isLoading && (
        <div className={style.tableLoadingOverlay}>
          <div className={style.tableLoadingContent}>
            <IconLoading width={60} height={60} />
            <div className={style.tableLoadingText}>Loading</div>
          </div>
        </div>
      )}
    </div>
  );
}
