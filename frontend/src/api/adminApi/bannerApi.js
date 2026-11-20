import axiosInstance from "../axiosConfig";

export const adminBannerApi = {
  list: (params) => axiosInstance.get("/admin/banners", { params }),
  get: (id) => axiosInstance.get(`/admin/banners/${id}`),
  create: (data) => axiosInstance.post("/admin/banners", data),
  update: (id, data) => axiosInstance.put(`/admin/banners/${id}`, data),
  remove: (id) => axiosInstance.delete(`/admin/banners/${id}`),
  setActive: (id, data) => axiosInstance.patch(`/admin/banners/${id}/active`, data),
};
