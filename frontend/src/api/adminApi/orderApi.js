import axiosInstance from "../axiosConfig";

export const adminOrderApi = {
  list: (params) => axiosInstance.get("/admin/orders", { params }),
  get: (id) => axiosInstance.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => axiosInstance.patch(`/admin/orders/${id}/status`, { status }),
};
