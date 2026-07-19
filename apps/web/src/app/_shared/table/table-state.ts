import { SortingState } from "@tanstack/react-table";

export interface TableState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;

  page: number;
  rawSorting?: SortingState;
}
