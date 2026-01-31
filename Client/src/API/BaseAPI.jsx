import axios from "axios";

const BaseAPI = axios.create({
  baseURL: "https://alyasine.onrender.com/api",
});

export default BaseAPI;
