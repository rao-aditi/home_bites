import axiosInstance from "../axiosConfig";

export const adminSettingsApi = {
  get: () => axiosInstance.get("/admin/settings"),
  update: (data) => axiosInstance.put("/admin/settings", data),
};
