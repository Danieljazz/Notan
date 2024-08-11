import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export const testUrl = "http://127.0.0.1:3000/api/v1";
