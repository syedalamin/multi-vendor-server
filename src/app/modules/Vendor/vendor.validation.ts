import z from "zod";

const vendorUpdateValidation = z.object({
  body: z.object({
    shopName: z
      .string()
      .min(2, { message: "Shop Name must be 2 characters" })
      .max(20, { message: "Shop Name must be lest then  20 characters" })
      .optional(),
      
    email: z.email().optional(),
    contactNumber: z
      .string()
      .optional(),
    address: z.string().optional(),
  }),
});

export const VendorValidation = {
  vendorUpdateValidation,
};
