import axiosInstance from "../axiosConfig";

export const bannerApi = {
  getBanners: (params) => axiosInstance.get("/banners", { params }),
};
