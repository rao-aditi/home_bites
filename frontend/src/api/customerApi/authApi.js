import axiosInstance from "../axiosConfig";

export const authApi = {
  login: (data) => axiosInstance.post("/auth/login", data),
  register: (data) => axiosInstance.post("/auth/register", data),
  getMe: () => axiosInstance.get("/auth/me"),
};
