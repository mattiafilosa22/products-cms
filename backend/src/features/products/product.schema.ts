import { z } from "zod";

// Base schema without refinement
const baseProductSchema = z.object({
  name: z.string().min(1),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Il prezzo deve essere maggiore di zero")
  ),
  discountPrice: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
    z.union([
      z.number().positive("Il prezzo scontato deve essere maggiore di zero"),
      z.literal(null)
    ]).nullable()
  )
});

// Create schema with refinement for price validation
export const createProductSchema = baseProductSchema
  .refine((data) => {
    // Se non c'è lo sconto, la riga è valida per questa regola
    if (!data.discountPrice) return true;

    // Se c'è, deve essere più piccolo del prezzo base
    return data.discountPrice < data.price;
  }, {
    message: "Il prezzo scontato deve essere inferiore al prezzo originale",
    path: ["discountPrice"]
  });

// Update schema - partial of base schema with refinement
export const updateProductSchema = baseProductSchema.partial()
  .refine((data) => {
    // Se non c'è lo sconto, la riga è valida per questa regola
    if (!data.discountPrice) return true;

    // Se c'è il prezzo e lo sconto, lo sconto deve essere più piccolo del prezzo base
    if (data.price && data.discountPrice) {
      return data.discountPrice < data.price;
    }

    return true;
  }, {
    message: "Il prezzo scontato deve essere inferiore al prezzo originale",
    path: ["discountPrice"]
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;