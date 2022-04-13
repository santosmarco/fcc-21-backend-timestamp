import type { RequestHandler } from "express";
import type { ApiResponse, ApiResponseFail, ApiResponseSuccess } from "./types";

export const handleTimestamp: RequestHandler<
  { input?: string },
  ApiResponse
> = (req, res) => {
  const {
    params: { input },
  } = req;

  const normalizedInput = normalizeInput(input);

  if (!validateInput(normalizedInput)) {
    res.json(buildResponseFail());
    return;
  }

  const date = getDate(normalizedInput);

  res.json(buildResponseSuccess(date));
};

type NormalizedInput = string | number | undefined;

const normalizeInput = (input: string | undefined): NormalizedInput => {
  if (!input) {
    return undefined;
  }

  const onlyNumbersRegExp = /^\d+$/;

  if (input.match(onlyNumbersRegExp)) {
    return Number.parseInt(input);
  }

  return input;
};

const validateInput = (normalizedInput: NormalizedInput): boolean => {
  return (
    !normalizedInput ||
    typeof normalizedInput === "number" ||
    !isNaN(Date.parse(normalizedInput))
  );
};

const getDate = (normalizedInput: NormalizedInput): Date => {
  if (!normalizedInput) {
    return new Date();
  }
  return new Date(normalizedInput);
};

export const getUnix = (date: Date): number => {
  return date.getTime();
};

export const getUtcString = (date: Date): string => {
  const utc = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
  return utc.toUTCString();
};

const buildResponseSuccess = (date: Date): ApiResponseSuccess => {
  return {
    unix: getUnix(date),
    utc: getUtcString(date),
  };
};

const buildResponseFail = (): ApiResponseFail => {
  return { error: "Invalid Date" };
};
