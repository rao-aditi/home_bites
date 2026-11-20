import axiosInstance from "../axiosConfig";

export const adminCustomerApi = {
  list: (params) => axiosInstance.get("/admin/customers", { params }),
  get: (id) => axiosInstance.get(`/admin/customers/${id}`),
  setActive: (id, data) => axiosInstance.patch(`/admin/customers/${id}/active`, data),
};
