import axiosInstance from "../axiosConfig";

export const adminCategoryApi = {
  list: (params) => axiosInstance.get("/admin/categories", { params }),
  get: (id) => axiosInstance.get(`/admin/categories/${id}`),
  create: (data) => axiosInstance.post("/admin/categories", data),
  update: (id, data) => axiosInstance.put(`/admin/categories/${id}`, data),
  remove: (id) => axiosInstance.delete(`/admin/categories/${id}`),
  setActive: (id, data) => axiosInstance.patch(`/admin/categories/${id}/active`, data),
};
