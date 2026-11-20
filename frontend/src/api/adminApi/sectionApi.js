import axiosInstance from "../axiosConfig";

export const adminSectionApi = {
  list: (params) => axiosInstance.get("/admin/homepage-sections", { params }),
  get: (id) => axiosInstance.get(`/admin/homepage-sections/${id}`),
  create: (data) => axiosInstance.post("/admin/homepage-sections", data),
  update: (id, data) => axiosInstance.put(`/admin/homepage-sections/${id}`, data),
  remove: (id) => axiosInstance.delete(`/admin/homepage-sections/${id}`),
  setVisible: (id, data) => axiosInstance.patch(`/admin/homepage-sections/${id}/visible`, data),
};
