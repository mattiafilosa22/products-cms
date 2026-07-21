"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";

export const useProductQuery = (id: number) => {
  return useQuery({
    queryKey: productsQueryKeys.detail(id),
    queryFn: () => fetchProductById(id),
  });
};
