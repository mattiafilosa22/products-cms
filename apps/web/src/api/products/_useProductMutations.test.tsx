import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as productsApi from "./_productsApi";
import { productsQueryKeys } from "./_queryKeys";
import type { Product } from "./_type";
import { useDeleteProductMutation } from "./_useDeleteProductMutation";
import { useImportProductsMutation } from "./_useImportProductsMutation";
import { useUpdateProductMutation } from "./_useUpdateProductMutation";

// vi.mock calls are hoisted above imports by Vitest's transform.
vi.mock("./_productsApi", async () => {
  const actual =
    await vi.importActual<typeof import("./_productsApi")>("./_productsApi");
  return {
    ...actual,
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    importProducts: vi.fn(),
  };
});

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

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

describe("product mutations", () => {
  it("invalidates the products cache after a successful update", async () => {
    vi.mocked(productsApi.updateProduct).mockResolvedValue(product);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateProductMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(product);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: productsQueryKeys.all,
    });
  });

  it("invalidates the products cache after a successful delete", async () => {
    vi.mocked(productsApi.deleteProduct).mockResolvedValue({
      message: "Eliminato correttamente",
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteProductMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(product.id);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: productsQueryKeys.all,
    });
  });

  it("invalidates the products cache after a successful import", async () => {
    vi.mocked(productsApi.importProducts).mockResolvedValue({ count: 3 });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useImportProductsMutation(), {
      wrapper: createWrapper(queryClient),
    });

    const file = new File(["name,price\nMouse,25"], "products.csv", {
      type: "text/csv",
    });

    await act(async () => {
      await result.current.mutateAsync(file);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: productsQueryKeys.all,
    });
  });
});
