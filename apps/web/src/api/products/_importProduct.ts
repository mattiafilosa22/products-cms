"use client";

import { useApi } from "../useApi";

export const useImportProduct = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- known debt: typed with the data layer refactor (Piece 6)
  const { execute, isLoading, data, error } = useApi<any>(
    "/products/import",
    "POST",
  );

  const importProduct = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await execute(formData);
  };

  return { importProduct, isLoading, data, error };
};
