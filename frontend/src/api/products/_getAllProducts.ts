import { useCallback } from "react";
import { useApi } from "../useApi";
import { Product } from "./_type";

export type GetAllProductsRequest = {
  page?: number;
  limit?: number;
};

export type GetAllProductsResponse = {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
};

export const getAllProducts = () => {
  const { data, isLoading, error, execute } = useApi<GetAllProductsResponse>(`/products`, "GET", true);

  const getProducts = useCallback((input: GetAllProductsRequest) => execute(input), [execute]);

  return { data, isLoading, error, getProducts };
}
