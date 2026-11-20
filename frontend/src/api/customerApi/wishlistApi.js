import axiosInstance from "../axiosConfig";

export const wishlistApi = {
  getWishlist: () => axiosInstance.get("/wishlist"),
  addToWishlist: (data) => axiosInstance.post("/wishlist", data),
  removeFromWishlist: (foodId) => axiosInstance.delete(`/wishlist/${foodId}`),
};
