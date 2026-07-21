import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as productsApi from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";
import type { Product } from "./_type";
import { useProductsQuery } from "./_useProductsQuery";

// vi.mock calls are hoisted above imports by Vitest's transform, so this
// still applies before `productsApi` (and the hook under test) are loaded.
vi.mock("./_productsApi", async () => {
  const actual =
    await vi.importActual<typeof import("./_productsApi")>("./_productsApi");
  return { ...actual, fetchProducts: vi.fn() };
});

const product: Product = {
  id: 1,
  name: "Laptop",
  description: null,
  price: 1200,
  discountPrice: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProductsQuery", () => {
  it("stores the response under the products/list query key built from the params", async () => {
    const result = {
      data: [product],
      pagination: { total: 1, page: 2, limit: 10 },
    };
    vi.mocked(productsApi.fetchProducts).mockResolvedValue(result);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const params = { page: 2, limit: 10, search: "laptop" };

    const { result: hookResult } = renderHook(() => useProductsQuery(params), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(hookResult.current.isSuccess).toBe(true));

    expect(productsApi.fetchProducts).toHaveBeenCalledWith(params);
    expect(queryClient.getQueryData(productsQueryKeys.list(params))).toEqual(
      result,
    );
  });
});
