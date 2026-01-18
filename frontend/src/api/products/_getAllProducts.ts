import { useCallback } from "react";
import { useApi } from "../useApi";
import { Product } from "./_type";

export type GetAllProductsParams = {
  page?: number;
  limit?: number;
};

export type GetAllProductsResponse = {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
};

export const getAllProducts = () => {
  const { data, isLoading, error, execute } = useApi<GetAllProductsResponse>(`/products`, "GET");

  const getProducts = useCallback((input: GetAllProductsParams) => execute({ input }), [execute]);

  return { data, isLoading, error, getProducts };
}