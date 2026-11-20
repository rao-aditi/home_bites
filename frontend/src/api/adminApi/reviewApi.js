import axiosInstance from "../axiosConfig";

export const adminReviewApi = {
  list: (params) => axiosInstance.get("/admin/reviews", { params }),
  setHidden: (id, data) => axiosInstance.patch(`/admin/reviews/${id}/hidden`, data),
  remove: (id) => axiosInstance.delete(`/admin/reviews/${id}`),
};
