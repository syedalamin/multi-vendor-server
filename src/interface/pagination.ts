export  type ISortOrder = 'asc' | 'desc';
export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string | undefined;
  sortOrder?: ISortOrder;
};


export type IOptionsResult = {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: ISortOrder
}
