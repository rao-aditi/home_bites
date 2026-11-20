import axiosInstance from "../axiosConfig";

export const adminFoodApi = {
  list: (params) => axiosInstance.get("/admin/foods", { params }),
  get: (id) => axiosInstance.get(`/admin/foods/${id}`),
  create: (data) => axiosInstance.post("/admin/foods", data),
  update: (id, data) => axiosInstance.put(`/admin/foods/${id}`, data),
  remove: (id) => axiosInstance.delete(`/admin/foods/${id}`),
  setFlags: (id, data) => axiosInstance.patch(`/admin/foods/${id}/flags`, data),
};
