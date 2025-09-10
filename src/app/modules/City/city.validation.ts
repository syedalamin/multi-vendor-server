import z from "zod";

const cityValidation = z.object({
  body: z.object({
    name: z.string().nonempty("City name is required"),
  }),
});
const updateCityValidation = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const CityValidations = {
  cityValidation,
  updateCityValidation,
};
