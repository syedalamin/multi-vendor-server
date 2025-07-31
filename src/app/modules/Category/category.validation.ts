import z from "zod";

const categoryValidation = z.object({
  body: z.object({
    name: z.string().nonempty("Category name is required"),
  }),
});
const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const CategoryValidations = {
  categoryValidation,
  updateCategoryValidation,
};
