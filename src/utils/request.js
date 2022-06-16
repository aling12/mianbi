import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
});

export default request;
