import axios from "axios";

const api = axios.create({
  baseURL: "https://paradise-code.cyclic.cloud/api/v1",
});

export default api;
