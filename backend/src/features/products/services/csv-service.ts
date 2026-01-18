import fs from 'fs';
import csv from 'csv-parser';

export const parseProductsFromCsv = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const formattedProduct = {
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        }
        results.push(formattedProduct);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};