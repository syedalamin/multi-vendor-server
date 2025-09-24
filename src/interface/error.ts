export type TErrors = {
  path: string;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errors: TErrors;
};
