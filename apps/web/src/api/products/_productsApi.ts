import type { PaginationData } from "mama";
import apiClient from "../apiClient";
import { Product } from "./_type";

export type FetchProductsParams = {
  page: number;
  limit: number;
  search?: string;
};

export type FetchProductsResult = {
  data: Product[];
  pagination: PaginationData;
};

type ProductsListApiResponse = {
  success: true;
  data: Product[];
  pagination: PaginationData;
};

type ProductApiResponse = {
  success: true;
  data: Product;
};

type DeleteProductApiResponse = {
  success: true;
  message: string;
};

type ImportProductsApiResponse = {
  success: true;
  count: number;
};

export const fetchProducts = async (
  params: FetchProductsParams,
): Promise<FetchProductsResult> => {
  const response = await apiClient.get<ProductsListApiResponse>("/products", {
    params,
  });
  return { data: response.data.data, pagination: response.data.pagination };
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<ProductApiResponse>(`/products/${id}`);
  return response.data.data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await apiClient.put<ProductApiResponse>(
    `/products/${product.id}`,
    product,
  );
  return response.data.data;
};

export const deleteProduct = async (
  id: number,
): Promise<{ message: string }> => {
  const response = await apiClient.delete<DeleteProductApiResponse>(
    `/products/${id}`,
  );
  return { message: response.data.message };
};

export const importProducts = async (
  file: File,
): Promise<{ count: number }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ImportProductsApiResponse>(
    "/products/import",
    formData,
    // Drop the default JSON content-type so axios lets the browser set the
    // multipart boundary for the FormData body.
    { headers: { "Content-Type": undefined } },
  );
  return { count: response.data.count };
};
