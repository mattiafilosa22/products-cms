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
import { PaginationData } from "../pagination-data";
import { useTableContext } from "./table-context";
import { TablePagination } from "./table-pagination";
import style from "../table.module.scss";
import IconLoading from "../../assets/icons/loading.svg";
import { TableActionConfig } from "../table-action-config";
import { AppButton, Modal, useModalContext } from "../../components";
import { ModalResult } from "../../components/modal/modal-result";
import { TableState } from "../table-state";

type ContainerProps<TData> = {
  pagination?: PaginationData;
  data: TData[];
  columns: ColumnDef<TData>[];
  actions: TableActionConfig<TData>[];
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;
  onStateChange?: (state: TableState) => void;
};

export function TableInner<TData extends object>({
  pagination = undefined,
  data = [],
  columns,
  actions,
  isLoading = false,
  onRowClick = undefined,
  onStateChange = undefined,
}: ContainerProps<TData>) {
  const { changeTableState, tableState } = useTableContext();

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updaterOrValue) => {
      changeTableState((prev) => {
        const newSorting =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev.rawSorting ?? [])
            : updaterOrValue;
        return { ...prev, rawSorting: newSorting } as TableState;
      });
    },
    [changeTableState],
  );

  const tableConfig: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableSorting: false,
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
      changeTableState((prev) => ({ ...prev, page: selected }) as TableState);
    },
    [changeTableState],
  );

  useEffect(() => {
    onStateChange?.(tableState);
  }, [tableState, onStateChange]);

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
            // Only call action if there's no modal
            if (!action.modalContent && !action.modalContentTitle) {
              action.action?.(rowData);
            }
          }}
        />
      );

      // Check if modal content is provided (either as a function or as title/body)
      if (action.modalContent || action.modalContentTitle) {
        // Create a component for simple title/body modals
        const SimpleModalContent = () => {
          const { setTitle, setConfirmConfig, tryClose } = useModalContext();

          useEffect(() => {
            if (action.modalContentTitle) {
              setTitle(action.modalContentTitle);
            }

            setConfirmConfig({
              onClick: async () => {
                await action.action?.(rowData);
                tryClose(true);
              },
            });
          }, [setTitle, setConfirmConfig, tryClose, action, rowData]);

          return action.modalContentBody ? (
            <p>{action.modalContentBody}</p>
          ) : null;
        };

        return (
          <Modal
            key={`modal-${index}`}
            trigger={button}
            onClose={(result) => onActionModalClosed(result, action)}
            style={action.variant === "danger" ? "danger" : "default"}
          >
            {action.modalContent ? (
              action.modalContent(rowData)
            ) : (
              <SimpleModalContent />
            )}
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
                    <div className="th-wrapper">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
                      {secondaryActionsState.map((action, index) =>
                        getActionButton(action, row.original, index, "md"),
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
