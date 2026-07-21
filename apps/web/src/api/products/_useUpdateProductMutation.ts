"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "../_getErrorMessage";
import { updateProduct } from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";
import { Product } from "./_type";

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Product) => updateProduct(product),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
      toast.success("Operazione completata");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};
