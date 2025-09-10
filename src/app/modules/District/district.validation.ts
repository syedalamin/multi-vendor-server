import z from "zod";

const districtValidation = z.object({
  body: z.object({
    name: z.string().nonempty("District name is required"),
  }),
});
const updateDistrictValidation = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const DistrictValidations = {
  districtValidation,
  updateDistrictValidation,
};
