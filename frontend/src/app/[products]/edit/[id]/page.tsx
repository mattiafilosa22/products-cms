"use client";

import { getProduct } from "@/api/products/_getProduct";
import { useEffect, use } from "react";
import { ProductForm } from "../../_components/product-form/product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getProductById, isLoading, data } = getProduct();

  useEffect(() => {
    getProductById(id);
  }, [id]);

  return (
    <div>
      <h2>Edit Product {id}</h2>
      <ProductForm product={data} />
    </div>
  );
}
