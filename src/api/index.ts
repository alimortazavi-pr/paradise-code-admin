import axios from "axios";

const api = axios.create({
  baseURL: "https://edu-paradise-code.liara.run/api/v1",
});

export default api;
