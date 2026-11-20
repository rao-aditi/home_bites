import axiosInstance from "../axiosConfig";

export const adminAuthApi = {
  login: (data) => axiosInstance.post("/admin/auth/login", data),
  getMe: () => axiosInstance.get("/admin/auth/me"),
};
