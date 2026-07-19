import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    console.error(
      "ERRORE DI CONFIGURAZIONE: ADMIN_API_KEY non definita nel .env",
    );
    return res
      .status(500)
      .json({ success: false, error: "Server configuration error" });
  }

  if (!apiKey || apiKey !== adminKey) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  next();
};
