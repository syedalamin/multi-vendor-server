import z from "zod";

const subCategoryValidation = z.object({
  body: z.object({
    name: z.string().nonempty("Sub Category name is required"),
    categoryId: z.string().nonempty("Sub Category is required")
  }),
});
const updateSubCategoryValidation = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const SubCategoryValidations = {
  subCategoryValidation,
  updateSubCategoryValidation,
};
