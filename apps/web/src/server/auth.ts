// Same contract as the old Express authMiddleware: static API key compared
// against ADMIN_API_KEY. Returns the error Response, or null when authorized.
export const requireApiKey = (request: Request): Response | null => {
  const apiKey = request.headers.get("x-api-key");
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    console.error(
      "ERRORE DI CONFIGURAZIONE: ADMIN_API_KEY non definita nel .env",
    );
    return Response.json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  if (!apiKey || apiKey !== adminKey) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  return null;
};
