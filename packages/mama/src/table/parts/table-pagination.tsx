import { useCallback } from "react";
import ReactPaginate from "react-paginate";
import IconCaretLeft from "@/assets/icons/caret-left.svg";
import IconCaretRight from "@/assets/icons/caret-right.svg";
import style from "../table.module.scss";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
  selectedPage: number;
}

export const TablePagination = ({
  pageCount,
  onPageChange,
  selectedPage,
}: PaginationProps) => {
  const handlePageIndexClick = useCallback(
    ({ selected }: { selected: number }) => {
      onPageChange(selected);
    },
    [onPageChange],
  );

  return (
    <div className={style.pagination}>
      <ReactPaginate
        className={style.customPagination}
        pageClassName={style.customPagination__page}
        breakLabel="..."
        onPageChange={handlePageIndexClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel={<IconCaretLeft width={16} height={16} />}
        nextLabel={<IconCaretRight width={16} height={16} />}
        previousLinkClassName={style.customPagination__previousLink}
        nextLinkClassName={style.customPagination__nextLink}
        activeClassName={style.customPagination__active}
        disabledClassName={style.customPagination__disabled}
        breakClassName={style.customPagination__page}
        renderOnZeroPageCount={null}
        forcePage={selectedPage - 1}
      />
    </div>
  );
};
