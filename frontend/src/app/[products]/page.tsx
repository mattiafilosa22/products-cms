"use client";

import { useEffect } from "react";
import { getAllProducts } from "@/api/products/_getAllProducts";
import { ProductListTable } from "./_components/product-list-table/product-list-table";
import PageWrapper from "./_layout/page-wrapper/page-wrapper";
import { ImportModal } from "./_components/import-modal/import-modal";

export default function ProductsPage() {
  const { data, isLoading, error, getProducts } = getAllProducts();

  useEffect(() => {
    getProducts({ page: 1, limit: 10 });
  }, [getProducts]);

  return (
    <PageWrapper
      title="Products"
      actionButtons={[
        <ImportModal
          key="import-product-modal"
          onSuccess={() => getProducts({ page: 1, limit: 10 })}
        />,
      ]}
    >
      <ProductListTable
        data={data?.data}
        pagination={data?.pagination}
        onOptionsChange={getProducts}
        isDataLoading={isLoading}
      />
    </PageWrapper>
  );
}
