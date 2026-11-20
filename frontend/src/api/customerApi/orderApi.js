import axiosInstance from "../axiosConfig";

export const orderApi = {
  createOrder: (data) => axiosInstance.post("/orders", data),
  getOrders: () => axiosInstance.get("/orders"),
  getOrder: (id) => axiosInstance.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => axiosInstance.patch(`/orders/${id}/status`, { status }),
};
