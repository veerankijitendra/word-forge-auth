import type { Request, Response, NextFunction } from "express";
import { type ZodTypeAny, ZodError } from "zod";
import { response } from "./response";

export const validateResource =
  (schema: ZodTypeAny, source: "body" | "query" | "params" | "cookies") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        return res.status(400).json(response.error("Validation failed", e.issues));
      }
      next(e);
    }
  };
