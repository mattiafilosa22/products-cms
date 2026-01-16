import { z } from "zod";

const nomeSchema = z.object({
  nome: z.string().min(1),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive()
  ),
  discountPrice: z.preprocess(
    (val) => (val === "" || val === undefined ? null : Number(val)),
    z.number().positive().nullable()
  )
})
  .refine((data) => {
    // Se non c'è lo sconto, la riga è valida per questa regola
    if (!data.discountPrice) return true;

    // Se c'è, deve essere più piccolo del prezzo base
    return data.discountPrice < data.price;
  }, {
    message: "Il prezzo scontato deve essere inferiore al prezzo originale",
    path: ["discountPrice"] // Specifichiamo quale campo ha "colpa" dell'errore
  });