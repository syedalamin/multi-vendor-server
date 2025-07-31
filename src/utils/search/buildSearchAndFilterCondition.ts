export const buildSearchAndFilterCondition = <T>(
  filters: Partial<T> & { searchTerm?: string },
  searchAbleFields: string[],
  isDeleted: boolean = false
) => {
  const { searchTerm, ...filterData } = filters;
  const andConditions: any[] = [];

  // searchTerm
  if (searchTerm) {
    andConditions.push({
      OR: searchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
          mode: "insensitive",
        },
      })),
    });
  }
  // soft delete

  if (isDeleted) {
    andConditions.push({
      isDeleted: false,
    });
  }
  const whereConditions = {
    AND: andConditions,
  };

  return whereConditions;
};
