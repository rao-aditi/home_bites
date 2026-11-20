import axiosInstance from "../axiosConfig";

export const addressApi = {
  getAddresses: () => axiosInstance.get("/addresses"),
  addAddress: (data) => axiosInstance.post("/addresses", data),
  updateAddress: (id, data) => axiosInstance.patch(`/addresses/${id}`, data),
  deleteAddress: (id) => axiosInstance.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => axiosInstance.patch(`/addresses/${id}/default`),
};
