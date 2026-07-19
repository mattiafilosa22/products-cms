import { SortingState } from "@tanstack/react-table";

export interface TableState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: typed with the data layer refactor (Piece 6)
  [x: string]: any;

  page: number;
  rawSorting?: SortingState;
}
