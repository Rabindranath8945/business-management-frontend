import axios from "axios";

const api = axios.create({
  baseURL: "https://business-management-dbhh.onrender.com/api",
});

export default api;
