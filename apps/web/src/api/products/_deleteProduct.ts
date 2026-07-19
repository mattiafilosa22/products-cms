"use client";

import { useApi } from "../useApi";
import { useCallback } from "react";

export const useDeleteProduct = () => {
  const { execute, isLoading, error } = useApi<void>(`/products/:id`, "DELETE");

  const deleteProduct = useCallback((id: number) => execute({ id }), [execute]);

  return { deleteProduct, isLoading, error };
}
