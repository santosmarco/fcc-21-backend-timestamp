export type ApiResponseSuccess = {
  unix: number;
  utc: string;
};

export type ApiResponseFail = {
  error: string;
};

export type ApiResponse = ApiResponseSuccess | ApiResponseFail;
