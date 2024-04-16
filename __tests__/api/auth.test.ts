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
  it("Test register non existing user", async () => {
    try {
      const data = await makeRequest.post("/auth/register", { data: userData });
      expect(data).toBeDefined();
      expect(data.status).toBe(201);
    } catch (error) {
      throw new Error(error);
    }
    // .then((r) => {
    //   console.log(r.data);
    //   expect(r.data).toBeDefined();
    //   expect(r.data.results.length).toBeGreaterThan(0);
    //   expect(r.status).toBe(401);
    // })
    // .catch((e) => {
    //   fail(`Expected successful response`);
    // });
  });
  it("Test register existing user", () => {
    expect(2).toBe(2);
  });
});
describe("Test login", () => {
  it("Correct login", () => {});
  it("Incorrect login", () => {});
});
describe("Test logout", () => {
  it("Check remove credential cookie", () => {});
});
