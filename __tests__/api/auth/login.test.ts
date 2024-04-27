import { testUrl } from "../utils/makeRequest";

const userData = { email: "f@b.c", password: "hahaha" };
describe("Test login", () => {
  it("Correct login", async () => {
    const response = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()[0]).toContain("notan-credentials=");
    expect(await response.json()).toStrictEqual({
      message: "User logged in properly",
    });
  });
  it("Incorrect login", async () => {
    const response = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: "fake", password: "fake" }),
      credentials: "include",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
    expect(response.headers.getSetCookie()).not.toContain("notan-credentials=");
    expect(await response.json()).toStrictEqual({
      message: "Wrong credentials",
    });
  });
});
describe("Test logout", () => {
  it("Check remove credential cookie", async () => {
    await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const response = await fetch(`${testUrl}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()).not.toContain("notan-credentials=");
    expect(await response.json()).toStrictEqual({
      message: "User logout properly",
    });
  });
});
