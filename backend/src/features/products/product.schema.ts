import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(20, "Il nome deve essere lungo al massimo 20 caratteri"),
  description: z.string().max(200, "La descrizione deve essere lunga al massimo 200 caratteri").nullable(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Il prezzo deve essere maggiore di zero")
  ),
  discountPrice: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
    z.number().positive("Il prezzo scontato deve essere maggiore di zero").nullable()
  )
}).refine((data) => {
  if (!data.discountPrice) return true;
  return data.discountPrice < data.price;
}, {
  message: "Il prezzo scontato deve essere inferiore al prezzo originale",
  path: ["discountPrice"]
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(20, "Il nome deve essere lungo al massimo 20 caratteri").optional(),
  description: z.string().max(200, "La descrizione deve essere lunga al massimo 200 caratteri").nullable().optional(),
  price: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  discountPrice: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
    z.number().positive().nullable().optional()
  )
}).refine((data) => {
  if (!data.discountPrice) return true;
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