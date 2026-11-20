import axiosInstance from "../axiosConfig";

export const adminDashboardApi = {
  getDashboard: () => axiosInstance.get("/admin/dashboard"),
};
