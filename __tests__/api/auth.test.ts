import { fail } from "assert";
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
