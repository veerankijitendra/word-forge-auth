import request from "supertest";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import { validateResource } from "../validateResource";

// Create a dummy schema strictly for testing
const testSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    age: z.number().optional(),
  }),
});

// Create a small, isolated Express instance specifically to test the middleware
const testApp = express();
testApp.use(express.json());

testApp.post("/test", validateResource(testSchema, "body"), (req: Request, res: Response) => {
  res.status(200).send("Success");
});

describe("validateResource middleware", () => {
  it("should pass if the request body is valid", async () => {
    const res = await request(testApp).post("/test").send({ name: "ValidName" });

    expect(res.status).toBe(200);
    expect(res.text).toBe("Success");
  });

  it("should return 400 and formatting errors if body is invalid", async () => {
    const res = await request(testApp).post("/test").send({ name: "ab" }); // Name is too short (min 3)

    expect(res.status).toBe(400);
    expect((res.body as { status: string }).status).toBe("error");
    expect((res.body as { message: string }).message).toBe("Validation failed");
    expect((res.body as { errors: Array<{ path: string[] }> }).errors[0].path).toEqual([
      "body",
      "name",
    ]);
  });
});
