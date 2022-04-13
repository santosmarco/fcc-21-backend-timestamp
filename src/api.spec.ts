import type { Request, Response } from "express";
import { getUnix, getUtcString, handleTimestamp } from "./api";
import type { ApiResponse, ApiResponseFail, ApiResponseSuccess } from "./types";

const testResponse = <T extends ApiResponse = ApiResponse>(
  input: string
): T => {
  const req = { params: { input } };

  let resBody = {} as T;

  const res = {
    json: jest.fn((arg) => {
      resBody = arg;
    }),
  };

  handleTimestamp(
    req as Request<{ input: string }>,
    res as unknown as Response,
    jest.fn()
  );

  return resBody;
};

describe("api", () => {
  describe("handleTimestamp", () => {
    let testInput = "2022-04-13T00:00:00-03:00";

    it("should return a JSON object with a `unix` key", () => {
      expect(Object.keys(testResponse(testInput))).toContain("unix");
    });

    it("should have `unix` as a number", () => {
      expect(typeof testResponse<ApiResponseSuccess>(testInput).unix).toBe(
        "number"
      );
    });

    it("should return a JSON object with a `utc` key", () => {
      expect(Object.keys(testResponse(testInput))).toContain("utc");
    });

    it("should have `utc` as a string", () => {
      expect(typeof testResponse<ApiResponseSuccess>(testInput).utc).toBe(
        "string"
      );
    });

    it("should have the correct value for `utc`", () => {
      expect(testResponse<ApiResponseSuccess>(testInput).utc).toBe(
        "Wed, 13 Apr 2022 03:00:00 GMT"
      );
    });

    it("should return the correct response for valid date input", () => {
      expect(testResponse<ApiResponseSuccess>("1451001600000")).toEqual({
        unix: 1451001600000,
        utc: "Fri, 25 Dec 2015 00:00:00 GMT",
      });
    });

    it("should return 'invalid date'", () => {
      expect(testResponse<ApiResponseFail>("invalid input")).toEqual({
        error: "Invalid Date",
      });
    });

    it("should return the current time", () => {
      const now = new Date();
      const res = testResponse<ApiResponseSuccess>("");
      expect(res.unix).toBeLessThan(getUnix(now) + 5);
      expect(res.utc).toBe(getUtcString(now));
    });
  });
});
