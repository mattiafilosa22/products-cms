import { NextRequest } from "next/server";
import * as productService from "@/server/products/product-service";
import { parseProductsFromCsv } from "@/server/products/csv-parser";

export async function POST(request: NextRequest) {
  // Non-multipart requests behave like multer with no file: "File mancante".
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return Response.json(
      { success: false, error: "File mancante" },
      { status: 400 },
    );
  }

  // Same fileFilter as the old multer config: mimetype OR .csv extension.
  const isCsv =
    file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
  if (!isCsv) {
    return Response.json(
      { success: false, error: "Il file deve essere in formato CSV (.csv)" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await parseProductsFromCsv(buffer);
    if (!data) {
      return Response.json(
        { success: false, error: "File non valido" },
        { status: 400 },
      );
    }

    const result = await productService.bulkCreateProducts(data);
    return Response.json(
      { success: true, count: result.count },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
