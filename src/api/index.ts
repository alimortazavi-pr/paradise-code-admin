import axios from "axios";

const api = axios.create({
  baseURL: "https://api.alimortazavi.org/api/v1",
});

export default api;
