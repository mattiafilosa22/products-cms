import { NextRequest } from "next/server";
import { requireApiKey } from "@/server/auth";
import { parseJsonBody } from "@/server/http";
import * as productService from "@/server/products/product-service";
import { updateProductSchema } from "@/server/products/product.schema";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const id = Number((await context.params).id);
    if (isNaN(id)) {
      return Response.json(
        { success: false, error: "ID non valido" },
        { status: 400 },
      );
    }

    const product = await productService.findProductById(id);
    if (!product) {
      return Response.json(
        { success: false, error: "Prodotto non trovato" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: product }, { status: 200 });
  } catch {
    return Response.json(
      { success: false, error: "Errore interno" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  try {
    const id = Number((await context.params).id);
    if (isNaN(id)) {
      return Response.json(
        { success: false, error: "ID non valido" },
        { status: 400 },
      );
    }

    // Empty body = {}, malformed JSON = 400 (same semantics as express.json()).
    const body = await parseJsonBody(request);
    if (body instanceof Response) return body;

    const validation = updateProductSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { success: false, errors: validation.error.format() },
        { status: 400 },
      );
    }

    const product = await productService.updateExistingProduct(
      id,
      validation.data,
    );
    return Response.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return Response.json(
        { success: false, error: "Prodotto non trovato" },
        { status: 404 },
      );
    }
    return Response.json(
      { success: false, error: "Errore durante l'aggiornamento" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  try {
    const id = Number((await context.params).id);
    if (isNaN(id)) {
      return Response.json(
        { success: false, error: "ID non valido" },
        { status: 400 },
      );
    }

    await productService.removeProduct(id);
    return Response.json(
      { success: true, message: "Eliminato correttamente" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return Response.json(
        { success: false, error: "Prodotto non trovato" },
        { status: 404 },
      );
    }
    return Response.json(
      { success: false, error: "Errore durante l'eliminazione" },
      { status: 500 },
    );
  }
}
