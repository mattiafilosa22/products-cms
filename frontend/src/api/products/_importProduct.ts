import { useApi } from "../useApi";

export const useImportProduct = () => {
  const { execute, isLoading, data, error } = useApi<any>("/products/import", "POST");

  const importProduct = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await execute(formData);
  };

  return { importProduct, isLoading, data, error };
};
