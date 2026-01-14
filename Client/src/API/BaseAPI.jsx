import axios from "axios";

const BaseAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default BaseAPI;
