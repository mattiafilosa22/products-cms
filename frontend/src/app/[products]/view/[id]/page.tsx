"use client";

import { useEffect, use } from "react";
import { getProduct } from "@/api/products/_getProduct";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error, getProductById } = getProduct();

  useEffect(() => {
    getProductById(id);
  }, [id, getProductById]);


  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
