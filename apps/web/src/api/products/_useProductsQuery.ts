"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  type FetchProductsParams,
  type FetchProductsResult,
} from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";

export type ProductsQueryParams = FetchProductsParams;

export const useProductsQuery = (params: ProductsQueryParams) => {
  return useQuery<FetchProductsResult>({
    queryKey: productsQueryKeys.list(params),
    queryFn: () => fetchProducts(params),
  });
};
