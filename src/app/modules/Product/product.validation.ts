import z from "zod";

const productValidationSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required").min(1, "Name must be more then 1 word"),
    description: z.string().nonempty("Description is required"),
    price: z.number().min(1,"Price must be more then 0"),
    subCategoryId: z.uuid().nonempty("Sub category is required"),
    stock: z.int().min(1,"Stock must be more then 0"),
  }),
});

export const ProductValidation = {
  productValidationSchema,
};
