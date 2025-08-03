import z from "zod";

const cartCreateValidation = z.object({
  body: z.object({
    productId: z.uuid().nonempty("Product is must be given"),
    quantity: z.int().min(1, "Quantity  must be more then 0"),
  }),
});
const cartUpdateValidation = z.object({
  body: z.object({
    productId: z.uuid().nonempty("Product is must be given"),
    quantity: z.int().min(1, "Quantity  must be more then 0"),
  }),
});

export const CartValidation = {
  cartCreateValidation,
  cartUpdateValidation
};
