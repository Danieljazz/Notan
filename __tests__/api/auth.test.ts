import { makeRequest } from "./utils/makeRequest";
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
    email: faker.internet.email,
    password: "hahaha",
  };
  it("Test register non existing user", () => {
    makeRequest
      .post("/auth/register", userData)
      .then((r) => {
        expect(r.data).toBeDefined();
        expect(r.data.results.length).toBeGreaterThan(0);
        expect(r.status).toBe(201);
      })
      .catch((e) => {
        fail(`Expected successful response`);
      });
  });
  it("Test register existing user", () => {});
});
describe("Test login", () => {
  it("Correct login", () => {});
  it("Incorrect login", () => {});
});
test("Test logout", () => {
  it("Check remove credential cookie", () => {});
});
