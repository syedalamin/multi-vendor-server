import z from "zod";

const adminValidation = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      firstName: z
        .string()
        .min(2, { message: "First Name must be 2 characters" })
        .max(20, { message: "First Name must be at most 20 characters" }),
      middleName: z.string().optional(),
      lastName: z
        .string()
        .min(2, { message: "Last Name must be 2 characters" })
        .max(20, { message: "First Name must be at most 20 characters" }),
      email: z.email(),
      contactNumber: z.string({}),
      gender: z.enum(["MALE", "FEMALE"]),
    }),
  }),
});

const vendorValidation = z.object({
  body: z.object({
    password: z.string(),
    vendor: z.object({
      shopName: z
        .string({ message: "Shop Name is required" })
        .min(2, { message: "Shop Name must be 2 characters" })
        .max(20, { message: "Shop Name must be lest then  20 characters" }),

      email: z.email({ message: "Shop Email is required" }),
      contactNumber: z
        .string({ message: "Contact Number is required" })
        .min(1, "Contact Number is required "),
      district: z
        .string({ message: "Shop Address is required" })
        .min(1, "Address is required "),
      city: z
        .string({ message: "Shop Address is required" })
        .min(1, "Address is required "),
    }),
  }),
});

// const customerValidation = z.object({
//   body: z.object({
//     password: z.string(),
//     customer: z.object({
//       firstName: z
//         .string()
//         .min(2, { message: "First Name must be 2 characters" })
//         .max(20, { message: "First Name must be at most 20 characters" }),
//       middleName: z.string().optional(),
//       lastName: z
//         .string()
//         .min(2, { message: "Last Name must be 2 characters" })
//         .max(20, { message: "First Name must be at most 20 characters" }),
//       email: z.email(),
//       contactNumber: z.string().optional(),
//     }),
//   }),
// });
const customerValidation = z.object({
  body: z.object({
    password: z.string(),
    customer: z.object({
      email: z.email(),
    }),
  }),
});

const myProfileValidation = z.object({
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

export const UserValidations = {
  adminValidation,
  vendorValidation,
  customerValidation,
  myProfileValidation,
};
