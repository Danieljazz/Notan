// import { testUrl } from "../utils/makeRequest";

// const userData = { email: "f@b.c", password: "hahaha" };
// const defautlWorkspaceId = 5;
// const defautlFolderId = 4;
// const defaultFolderData = {
//   title: "New folder 3",
//   icon: "🎶",
//   logo: "",
//   workspaceId: defautlWorkspaceId,
// };

// describe("Create file", () => {
//   it("Authoritized user", async () => {
//     const logresp = await fetch(`${testUrl}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(userData),
//       credentials: "same-origin",
//     });
//     expect(logresp.status).toBe(200);
//     const response = await fetch(`${testUrl}/folders`, {
//       method: "POST",
//       body: JSON.stringify(defaultFolderData),
//       headers: {
//         Cookie: logresp.headers.getSetCookie()[0],
//       },
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(201);
//     expect(await response.json()).toStrictEqual({
//       message: "Workspace created!",
//     });
//   });
//   it("Unathoritized user", async () => {
//     const response = await fetch(`${testUrl}/folders`, {
//       method: "POST",
//       body: JSON.stringify(defaultFolderData),
//       credentials: "include",
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(403);
//     expect(await response.json()).toStrictEqual({
//       message: "User not logged in!",
//     });
//   });
// });

// describe("Get workspace", () => {
//   it("Authoritized user own workspace", async () => {
//     const logresp = await fetch(`${testUrl}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(userData),
//       credentials: "include",
//     });
//     expect(logresp.status).toBe(200);
//     const response = await fetch(`${testUrl}/folders/${defautlFolderId}`, {
//       method: "GET",
//       headers: {
//         Cookie: logresp.headers.getSetCookie()[0],
//       },
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(200);
//     const data = await response.json();
//     expect(data).toEqual(defaultFolderData);
//   });
//   it("Authoritized user others workspace", async () => {
//     const logresp = await fetch(`${testUrl}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(userData),
//       credentials: "include",
//     });
//     expect(logresp.status).toBe(200);
//     const response = await fetch(`${testUrl}/folders/2`, {
//       method: "GET",
//       headers: {
//         Cookie: logresp.headers.getSetCookie()[0],
//       },
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(403);
//     expect(await response.json()).toStrictEqual({
//       message: "Action not allowed!",
//     });
//   });
//   it("Unathoritized user", async () => {
//     const response = await fetch(`${testUrl}/folders/5`, {
//       method: "GET",
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(403);
//     expect(await response.json()).toStrictEqual({
//       message: "User not logged in!",
//     });
//   });
// });

// describe("Delete workspace", () => {
//   it("Authoritized user own workspace", async () => {
//     const logresp = await fetch(`${testUrl}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(userData),
//       credentials: "include",
//     });
//     expect(logresp.status).toBe(200);
//     const response = await fetch(`${testUrl}/workspaces/${userWorkspaceId}`, {
//       method: "GET",
//       headers: {
//         Cookie: logresp.headers.getSetCookie()[0],
//       },
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(200);
//     const data = await response.json();
//     expect(data).toEqual(userWorkspaceData);
//   });
//   it("Authoritized user others workspace", async () => {
//     const logresp = await fetch(`${testUrl}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(userData),
//       credentials: "include",
//     });
//     expect(logresp.status).toBe(200);
//     const response = await fetch(`${testUrl}/workspaces/2`, {
//       method: "GET",
//       headers: {
//         Cookie: logresp.headers.getSetCookie()[0],
//       },
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(403);
//     expect(await response.json()).toStrictEqual({
//       message: "Action not allowed!",
//     });
//   });
//   it("Unathoritized user", async () => {
//     const response = await fetch(`${testUrl}/workspaces/5`, {
//       method: "GET",
//     });
//     expect(response).toBeDefined();
//     expect(response.status).toBe(403);
//     expect(await response.json()).toStrictEqual({
//       message: "User not logged in!",
//     });
//   });
// });
