import { createContext, useState, useContext, useCallback } from "react";
import type { FC, ReactNode, SetStateAction } from "react";
import { TableState } from "../table-state";

export interface TableContextValue {
  tableState: TableState;
  changeTableState: (update: SetStateAction<TableState>) => void;
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

  const changeTableState = useCallback((update: SetStateAction<TableState>) => {
    setTableState(update);
  }, []);

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
