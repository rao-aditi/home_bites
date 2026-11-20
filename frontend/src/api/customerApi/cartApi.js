import axiosInstance from "../axiosConfig";

export const cartApi = {
  getCart: () => axiosInstance.get("/cart"),
  addToCart: (data) => axiosInstance.post("/cart", data),
  updateCartItem: (id, action) => axiosInstance.patch(`/cart/${id}`, { action }),
  removeCartItem: (id) => axiosInstance.delete(`/cart/${id}`),
  clearCart: () => axiosInstance.delete("/cart"),
};
