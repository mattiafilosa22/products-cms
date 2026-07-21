import { NextRequest } from "next/server";
import { parseJsonBody } from "@/server/http";
import * as productService from "@/server/products/product-service";
import { createProductSchema } from "@/server/products/product.schema";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 10;
    const search = params.get("search") || "";

    const { products, total } = await productService.findAllProducts(
      page,
      limit,
      search,
    );

    return Response.json(
      { success: true, data: products, pagination: { page, limit, total } },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { success: false, error: "Errore interno del server" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Empty body = {}, malformed JSON = 400 (same semantics as express.json()).
    const body = await parseJsonBody(request);
    if (body instanceof Response) return body;

    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { success: false, errors: validation.error.format() },
        { status: 400 },
      );
    }

    const product = await productService.createNewProduct(validation.data);
    return Response.json({ success: true, data: product }, { status: 201 });
  } catch {
    return Response.json(
      { success: false, error: "Errore durante la creazione" },
      { status: 500 },
    );
  }
}
