import { useState, useCallback } from "react";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

export function useApi<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE") {
  // set state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // function execute inside useCallback
  const execute = useCallback(async (input: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.request({
        method,
        url,
        data: method === "GET" || method === "DELETE" ? undefined : input,
        params: method === "GET" || method === "DELETE" ? input : undefined,
      });
      setData(response.data);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      // get error from response
      const apiError = error.response?.data || error;
      setError(apiError as Error);
      setData(null);
      toast.error(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }

  }, [url, method])

  return { isLoading, data, error, execute };
}