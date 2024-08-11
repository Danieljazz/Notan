import { testUrl } from "../utils/makeRequest";

const userData = { email: "f@b.c", password: "hahaha" };
const defautlWorkspace = {
  title: "Second workspace",
  icon: "🎶",
  inTrash: 0,
  logo: "",
  bannerUrl: "",
};
describe("Create workspace", () => {
  it("Authoritized user", async () => {
    const logresp = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "same-origin",
    });
    expect(logresp.status).toBe(200);
    const response = await fetch(`${testUrl}/workspaces`, {
      method: "POST",
      body: JSON.stringify(defautlWorkspace),
      headers: {
        Cookie: logresp.headers.getSetCookie()[0],
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(await response.json()).toStrictEqual({
      message: "Workspace created!",
    });
  });
  it("Unathoritized user", async () => {
    const response = await fetch(`${testUrl}/workspaces`, {
      method: "POST",
      body: JSON.stringify(defautlWorkspace),
      credentials: "include",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      message: "User not logged in!",
    });
  });
});

const userWorkspaceId = 5;
const userWorkspaceData = [
  {
    files: null,
    folders: {
      bannerUrl: null,
      createdAt: "2024-03-31 20:40:29",
      icon: "",
      id: 2,
      inTrash: false,
      logo: "",
      title: "New folder",
      workspaceId: 4,
    },
  },
  {
    files: null,
    folders: {
      bannerUrl: null,
      createdAt: "2024-04-11 20:43:24",
      icon: "",
      id: 4,
      inTrash: false,
      logo: "",
      title: "New folder",
      workspaceId: 5,
    },
  },
];
describe("Get workspace", () => {
  it("Authoritized user own workspace", async () => {
    const logresp = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
    });
    expect(logresp.status).toBe(200);
    const response = await fetch(`${testUrl}/workspaces/${userWorkspaceId}`, {
      method: "GET",
      headers: {
        Cookie: logresp.headers.getSetCookie()[0],
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(userWorkspaceData);
  });
  it("Authoritized user others workspace", async () => {
    const logresp = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
    });
    expect(logresp.status).toBe(200);
    const response = await fetch(`${testUrl}/workspaces/2`, {
      method: "GET",
      headers: {
        Cookie: logresp.headers.getSetCookie()[0],
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      message: "Action not allowed!",
    });
  });
  it("Unathoritized user", async () => {
    const response = await fetch(`${testUrl}/workspaces/5`, {
      method: "GET",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      message: "User not logged in!",
    });
  });
});

describe("Delete workspace", () => {
  it("Authoritized user own workspace", async () => {
    const logresp = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
    });
    expect(logresp.status).toBe(200);
    const response = await fetch(`${testUrl}/workspaces/${userWorkspaceId}`, {
      method: "GET",
      headers: {
        Cookie: logresp.headers.getSetCookie()[0],
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(userWorkspaceData);
  });
  it("Authoritized user others workspace", async () => {
    const logresp = await fetch(`${testUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify(userData),
      credentials: "include",
    });
    expect(logresp.status).toBe(200);
    const response = await fetch(`${testUrl}/workspaces/2`, {
      method: "GET",
      headers: {
        Cookie: logresp.headers.getSetCookie()[0],
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      message: "Action not allowed!",
    });
  });
  it("Unathoritized user", async () => {
    const response = await fetch(`${testUrl}/workspaces/5`, {
      method: "GET",
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      message: "User not logged in!",
    });
  });
});
