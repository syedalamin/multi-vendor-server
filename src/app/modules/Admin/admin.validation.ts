import z from "zod";

const adminUpdateValidation = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, { message: "First Name must be 2 characters" })
      .max(20, { message: "First Name must be at most 20 characters" })
      .optional(),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(2, { message: "Last Name must be 2 characters" })
      .max(20, { message: "First Name must be at most 20 characters" })
      .optional(),
    contactNumber: z.string({}).optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
  }),
});



export const AdminValidations = {
  adminUpdateValidation,

};
