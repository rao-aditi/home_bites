import axiosInstance from "../axiosConfig";

export const adminOfferApi = {
  list: (params) => axiosInstance.get("/admin/offers", { params }),
  get: (id) => axiosInstance.get(`/admin/offers/${id}`),
  create: (data) => axiosInstance.post("/admin/offers", data),
  update: (id, data) => axiosInstance.put(`/admin/offers/${id}`, data),
  remove: (id) => axiosInstance.delete(`/admin/offers/${id}`),
  setActive: (id, data) => axiosInstance.patch(`/admin/offers/${id}/active`, data),
};
