import { useCallback } from "react";
import { useApi } from "../useApi";
import { Product } from "./_type";

export const getProduct = () => {
  const { data, isLoading, error, execute } = useApi<Product>(`/products/:id`, "GET");

  const getProductById = useCallback((input: string) => execute({ input }), [execute]);
  
  return { data, isLoading, error, getProductById };
};