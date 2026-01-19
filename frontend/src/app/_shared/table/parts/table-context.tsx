import { createContext, useState, useContext, useCallback } from "react";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { TableState } from "../table-state";

export interface TableContextValue {
  tableState: TableState;
  changeTableState: (update: Dispatch<SetStateAction<TableState>>) => void;
}

interface TableContextProviderProps {
  children?: ReactNode;
}

const initialTableState: TableState = {
  page: 0,
};

export const TableContext = createContext<TableContextValue>({
  tableState: initialTableState,
  changeTableState: () => {},
});

export const TableContextProvider: FC<TableContextProviderProps> = (props) => {
  const { children } = props;
  const [tableState, setTableState] = useState<TableState>(initialTableState);

  const changeTableState: (cb: Dispatch<SetStateAction<TableState>>) => void =
    useCallback((update) => {
      const tableStateUpdated = update(tableState);
      setTableState(tableStateUpdated as unknown as TableState);
    }, [tableState]);

  return (
    <TableContext.Provider
      value={{
        tableState,
        changeTableState,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const TableConsumer = TableContext.Consumer;
export const useTableContext = () => useContext(TableContext);
