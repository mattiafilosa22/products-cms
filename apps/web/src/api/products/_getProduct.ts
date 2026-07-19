"use client";

import { useCallback } from "react";
import { useApi } from "../useApi";
import { Product } from "./_type";

type ProductResponse = {
  data: Product;
}

export const getProduct = () => {
  const { data, isLoading, error, execute } = useApi<ProductResponse>(`/products/:id`, "GET", true);

  const getProductById = useCallback((id: string) => execute({ id }), [execute]);

  return { data, isLoading, error, getProductById };
};
