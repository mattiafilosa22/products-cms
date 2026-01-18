"use client";

import { useEffect } from "react";
import { getAllProducts } from "@/api/products/_getAllProducts";

export default function ProductsPage() {
  const { data, isLoading, error, getProducts } = getAllProducts();
  useEffect(() => {
    getProducts({ page: 1, limit: 10 });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
