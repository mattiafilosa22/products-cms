import axios from "axios";

// Route Handlers report failures either as a plain string (`{ error }`) or,
// for 400s, as a Zod `.format()` payload (`{ errors }`): one field per key,
// each holding an `_errors` string array. This turns either shape into a
// single readable message for toasts.
type ZodFormattedField = { _errors: string[] };

type ApiErrorPayload = {
  success: false;
  error?: string;
  errors?: Record<string, ZodFormattedField | undefined>;
};

const isZodFormattedField = (value: unknown): value is ZodFormattedField =>
  typeof value === "object" &&
  value !== null &&
  Array.isArray((value as { _errors?: unknown })._errors);

const formatValidationErrors = (
  errors: ApiErrorPayload["errors"],
): string | null => {
  if (!errors) return null;

  const messages = Object.entries(errors)
    // Zod's `.format()` also carries a top-level `_errors` array: not a field.
    .filter(([field]) => field !== "_errors")
    .map(([field, value]) =>
      isZodFormattedField(value) && value._errors.length
        ? `${field}: ${value._errors.join(", ")}`
        : null,
    )
    .filter((message): message is string => message !== null);

  return messages.length ? messages.join(" | ") : null;
};

const DEFAULT_ERROR_MESSAGE = "Si è verificato un errore";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data;
    const validationMessage = formatValidationErrors(payload?.errors);
    if (validationMessage) return validationMessage;
    if (payload?.error) return payload.error;
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  if (error instanceof Error) return error.message;

  return DEFAULT_ERROR_MESSAGE;
};
