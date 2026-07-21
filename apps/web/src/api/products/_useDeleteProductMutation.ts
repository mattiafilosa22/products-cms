"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "../_getErrorMessage";
import { deleteProduct } from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};
