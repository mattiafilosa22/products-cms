import { useCallback } from "react";
import { useApi } from "../useApi";
import { Product } from "./_type";

type ProductResponse = {
  data: Product;
}

export const useUpdateProduct = () => {
  const { data, isLoading, error, execute } = useApi<ProductResponse>(`/products/:id`, "PUT");

  const updateProduct = useCallback((data: Product) => execute(data), [execute]);

  return { data, isLoading, error, updateProduct };
};
