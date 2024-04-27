import { fail } from "assert";
import { makeRequest } from "../utils/makeRequest";
import { faker } from "@faker-js/faker";

describe("Test register", () => {
  const userData = {
    name: "Jane",
    surname: "Doe",
    avatar_url: "",
    billing_address: {
      country: "PL",
      city: "City",
      street: "new street",
      house: 4,
    },
    payment_method: { type: "card" },
    email: faker.internet.email(),
    password: "hahaha",
  };
  it("Test register non existing user", async () => {
    try {
      const response = await makeRequest.post(
        "/auth/register",
        JSON.stringify(userData)
      );
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.data).toStrictEqual({ message: "Contact created" });
    } catch (error) {
      fail(`${error}`);
    }
  });
  it("Test register existing user", async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        { method: "POST", body: JSON.stringify(userData) }
      );
      expect(response).toBeDefined();
      expect(response.status).toBe(409);
      expect(await response.json()).toStrictEqual({
        message: "Email already exists",
      });
    } catch (error) {
      fail(`${error}`);
    }
  });
});
