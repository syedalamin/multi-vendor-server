import { IPaginationOptions, ISortOrder } from "../../interface/pagination";

export const buildSortCondition = (options: IPaginationOptions , allowedSortFields: string | string[], allowedSortOrder: string | string[]) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10000;
  const skip: number = (page - 1) * limit;

  const sortBy: string = allowedSortFields.includes(options.sortBy || "")
    ? options.sortBy!
    : "createdAt";

  const sortOrder: ISortOrder = allowedSortOrder.includes(
    options.sortOrder || ""
  )
    ? (options.sortOrder! as ISortOrder)
    : "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
