import fs from 'fs';
import csv from 'csv-parser';
import { createProductSchema } from '../product.schema.ts';

export const parseProductsFromCsv = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // map and validate data
        const formattedProduct = createProductSchema.safeParse({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        })

        // if validation fails reject
        if (!formattedProduct.success) {
          // block read stream
          stream.destroy();
          const errorMessage = JSON.stringify(formattedProduct.error.flatten().fieldErrors);
          reject(new Error(`Validazione fallita: ${errorMessage}`));
        }

        results.push(formattedProduct.data);
      })
      .on('end', () => {
        // close stream
        stream.destroy();
        resolve(results);
      })
      .on('error', (error) => {
        // close stream
        stream.destroy();
        console.error("Error parsing CSV:", error);
        reject(error);
      });
  });
};