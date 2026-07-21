import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getErrorMessage } from "./_getErrorMessage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getErrorMessage", () => {
  it("returns the plain error string from the API payload", () => {
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
    const error = {
      message: "Request failed",
      response: { data: { success: false, error: "Prodotto non trovato" } },
    };

    expect(getErrorMessage(error)).toBe("Prodotto non trovato");
  });

  it("formats Zod validation errors per field", () => {
    vi.spyOn(axios, "isAxiosError").mockReturnValue(true);
    const error = {
      message: "Request failed",
      response: {
        data: {
          success: false,
          errors: {
            name: { _errors: ["Il nome è obbligatorio"] },
            price: { _errors: ["Il prezzo deve essere maggiore di zero"] },
          },
        },
      },
    };

    expect(getErrorMessage(error)).toBe(
      "name: Il nome è obbligatorio | price: Il prezzo deve essere maggiore di zero",
    );
  });

  it("falls back to a default message for unknown errors", () => {
    expect(getErrorMessage("boom")).toBe("Si è verificato un errore");
  });
});
