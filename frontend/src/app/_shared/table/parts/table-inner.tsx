import {
  ColumnDef,
  TableOptions,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PaginationData } from "@/api/paginationData";
import { useTableContext } from "./table-context";
import { TablePagination } from "./table-pagination";
import style from "../table.module.scss";
import IconLoading from "@/assets/loading.svg";
import IconMore from "@/assets/icons/more-horizontal.svg";
import IconCaretUp from "@/assets/icons/caret-up.svg";
import IconCaretDown from "@/assets/icons/caret-down.svg";
import { useTranslations } from "next-intl";
import { TableActionConfig } from "../table-action-config";
// TODO: move to shared components
import { AppButton, ConfirmationModal, Modal } from "../../components";
import { Dropdown } from "../../components/dropdown/dropdown";
import { ModalResult } from "../../components/modal/modal-result";

type ContainerProps<TData> = {
  pageSize?: number;
  pagination?: PaginationData;
  data: TData[];
  columns: ColumnDef<TData>[];
  actions: TableActionConfig<TData>[];
  searchText?: string;
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;
};

export function TableInner<TData extends object>({
  pagination = undefined,
  data = [],
  columns,
  actions,
  searchText = undefined,
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
    [changeTableState]
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

  const t = useTranslations();

  const handlePageChange = useCallback(
    (selected: number) => {
      changeTableState((prev) => ({ ...prev, page: selected }));
    },
    [changeTableState]
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
    [changeTableState]
  );

  const getActionButton = useCallback(
    (
      action: TableActionConfig<TData>,
      rowData: TData,
      index: number,
      size: "md" | "icon"
    ) => {
      const button = (
        <AppButton
          key={index}
          labelKey={action.label}
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
      } else if (action.modalContentBody) {
        return (
          <ConfirmationModal
            key={`modal-${index}`}
            style="danger"
            trigger={button}
            size="md"
            titleKey={action.modalContentTitle ?? ""}
            messageKey={action.modalContentBody}
            onConfirm={() => action.action?.(rowData)}
            onCancel={() => {}}
          />
        );
      }

      return button;
    },
    [onActionModalClosed]
  );

  return (
    <div className={style.table}>
      {filters && <TableFilters filters={filters} searchText={searchText} />}

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
                            header.getContext()
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
                        cell.getContext()
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
                        getActionButton(action, row.original, index, "icon")
                      )}

                      {secondaryActionsState.length > 0 && (
                        <Dropdown
                          trigger={
                            <AppButton
                              labelKey="Common.more_actions"
                              icon={IconMore}
                              style="link"
                              variant="neutral"
                              size="icon"
                            />
                          }
                        >
                          {secondaryActionsState.map((action, index) =>
                            getActionButton(action, row.original, index, "md")
                          )}
                        </Dropdown>
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
          pageCount={pagination.totalPages}
          selectedPage={pagination.currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {isLoading && (
        <div className={style.tableLoadingOverlay}>
          <div className={style.tableLoadingContent}>
            <IconLoading width={60} height={60} />
            <div className={style.tableLoadingText}>{t("Table.loading")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
