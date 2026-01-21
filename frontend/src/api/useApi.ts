"use client";

import { useState, useCallback } from "react";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

const formatZodError = (errorStr: string) => {
  try {
    const obj = JSON.parse(errorStr.replace("Validazione fallita: ", ""));
    return Object.entries(obj)
      .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
      .join(" | ");
  } catch {
    return errorStr;
  }
};

export function useApi<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE", ignoreToast = false) {
  // set state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // function execute inside useCallback
  const execute = useCallback(async (input: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace URL parameters with actual values
      let finalUrl = url;
      const usedParams = new Set<string>();

      if (input && typeof input === 'object') {
        Object.keys(input).forEach(key => {
          if (finalUrl.includes(`:${key}`)) {
            finalUrl = finalUrl.replace(`:${key}`, input[key]);
            usedParams.add(key);
          }
        });
      }

      // Filter out params that were used in the URL
      const remainingParams = input && typeof input === 'object'
        ? Object.keys(input).reduce((acc, key) => {
          if (!usedParams.has(key)) {
            acc[key] = input[key];
          }
          return acc;
        }, {} as any)
        : undefined;

      const response = await apiClient.request({
        method,
        url: finalUrl,
        data: method === "GET" || method === "DELETE" ? undefined : input,
        params: method === "GET" || method === "DELETE" ? remainingParams : undefined,
        headers: input instanceof FormData ? { "Content-Type": undefined } : undefined,
      });
      setData(response.data);
      if (!ignoreToast) toast.success(response.data.message || "Operazione completata");
      return response.data;
    } catch (error: any) {
      // get error from response
      const apiError = error.response?.data || error;
      setError(apiError as Error);
      setData(null);

      const errorMessage = apiError.error || apiError.message || "Si è verificato un errore";
      toast.error(formatZodError(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }

  }, [url, method])

  return { isLoading, data, error, execute };
}
