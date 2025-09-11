import z from "zod";

const shippingInfoValidation = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, { message: "First Name must be 2 characters" })
      .max(20, { message: "First Name must be at most 20 characters" }),

    lastName: z
      .string()
      .min(2, { message: "Last Name must be 2 characters" })
      .max(20, { message: "First Name must be at most 20 characters" }),

    country: z.string().nonempty("Shipping Country is required"),
    districts: z.string(),
    city: z.string().nonempty("Shipping City is required"),
    address: z.string().nonempty("Shipping Address is required"),
    postalCode: z.string(), // ৪ digit check
    phone: z.string(),
  
    notes: z.string().optional(),
  }),
});

export const OrderValidation = {
  shippingInfoValidation,
};
