"use client";

import { useEffect } from "react";
import { getAllProducts } from "@/api/products/_getAllProducts";
import { ProductListTable } from "./_components/product-list-table/product-list-table";

export default function ProductsPage() {
  const { data, isLoading, error, getProducts } = getAllProducts();

  useEffect(() => {
    getProducts({ page: 1, limit: 10 });
  }, [getProducts]);

  return (
    <div>
      <ProductListTable
        data={data?.data}
        pagination={data?.pagination}
        onOptionsChange={getProducts}
        isDataLoading={isLoading}
      />
    </div>
  );
}
