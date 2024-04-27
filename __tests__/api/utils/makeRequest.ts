import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export const testUrl = "http://localhost:3000/api/v1";
