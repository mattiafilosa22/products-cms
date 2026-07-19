// Body parsing with the same semantics as express.json(): an absent/empty
// body counts as {}, while syntactically malformed JSON is a 400.
export const parseJsonBody = async (
  request: Request,
): Promise<unknown | Response> => {
  const raw = await request.text();
  if (raw.trim() === "") return {};

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return Response.json(
      { success: false, error: "JSON non valido" },
      { status: 400 },
    );
  }
};
