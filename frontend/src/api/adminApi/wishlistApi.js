import axiosInstance from "../axiosConfig";

export const adminWishlistApi = {
  list: (params) => axiosInstance.get("/admin/wishlist", { params }),
  stats: () => axiosInstance.get("/admin/wishlist/stats"),
};
