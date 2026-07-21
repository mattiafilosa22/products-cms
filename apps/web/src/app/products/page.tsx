"use client";

import { useState } from "react";
import {
  useProductsQuery,
  type ProductsQueryParams,
} from "@/api/products/_useProductsQuery";
import { ProductListTable } from "./_components/product-list-table/product-list-table";
import PageWrapper from "./_layout/page-wrapper/page-wrapper";
import { ImportModal } from "./_components/import-modal/import-modal";

const DEFAULT_QUERY_PARAMS: ProductsQueryParams = { page: 1, limit: 10 };

export default function ProductsPage() {
  const [queryParams, setQueryParams] =
    useState<ProductsQueryParams>(DEFAULT_QUERY_PARAMS);
  const { data, isLoading } = useProductsQuery(queryParams);

  return (
    <PageWrapper
      title="Prodotti"
      actionButtons={[<ImportModal key="import-product-modal" />]}
    >
      <ProductListTable
        data={data?.data}
        pagination={data?.pagination}
        onOptionsChange={setQueryParams}
        isDataLoading={isLoading}
      />
    </PageWrapper>
  );
}
