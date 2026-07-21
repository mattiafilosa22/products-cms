import type { FetchProductsParams } from "./_productsApi";

// Single source of truth for the products query keys: mutations invalidate
// `all`, queries scope themselves under `list`/`detail`.
export const productsQueryKeys = {
  all: ["products"] as const,
  list: (params: FetchProductsParams) => ["products", "list", params] as const,
  detail: (id: number) => ["products", "detail", id] as const,
};
