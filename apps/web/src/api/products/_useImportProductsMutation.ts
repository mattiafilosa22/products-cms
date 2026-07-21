"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getErrorMessage } from "../_getErrorMessage";
import { importProducts } from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";

export const useImportProductsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importProducts(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
      toast.success("Operazione completata");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
};
