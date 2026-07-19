import { Readable } from "node:stream";
import csv from "csv-parser";
import { createProductSchema, CreateProductInput } from "./product.schema";

type CsvRow = Record<string, string>;

// Parses the uploaded CSV from an in-memory buffer (no multer, no temp files).
// Fail-fast contract preserved from the Express backend: first invalid row
// rejects with the same literal message (header is row 1, data starts at 2).
export const parseProductsFromCsv = (
  buffer: Buffer,
): Promise<CreateProductInput[]> => {
  return new Promise((resolve, reject) => {
    const results: CreateProductInput[] = [];

    let rowCounter = 1; // Consider header as row 1, data starts at row 2
    const stream = Readable.from(buffer)
      .pipe(csv())
      .on("data", (data: CsvRow) => {
        rowCounter++;
        // map and validate data
        const formattedProduct = createProductSchema.safeParse({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          discountPrice: data.discountPrice
            ? parseFloat(data.discountPrice)
            : null,
        });

        // if validation fails reject
        if (!formattedProduct.success) {
          // block read stream
          stream.destroy();
          const errorMessage = JSON.stringify(
            formattedProduct.error.flatten().fieldErrors,
          );
          reject(
            new Error(
              `Errore alla riga ${rowCounter}: Validazione fallita: ${errorMessage}`,
            ),
          );
          return;
        }

        results.push(formattedProduct.data);
      })
      .on("end", () => {
        // close stream
        stream.destroy();
        resolve(results);
      })
      .on("error", (error) => {
        // close stream
        stream.destroy();
        console.error("Error parsing CSV:", error);
        reject(error);
      });
  });
};
