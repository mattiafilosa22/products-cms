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

  console.log("data", data);
  console.log("id", id);
  console.log("error", error);
  return (
    <div>
      <h1>Product</h1>
    </div>
  );
}
