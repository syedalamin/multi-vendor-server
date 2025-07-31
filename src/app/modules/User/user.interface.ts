import { UserRole } from "@prisma/client";

export type IUserFilterRequest = {
  email?: string | undefined;
  searchTerm?: string | undefined;
};


