import axiosInstance from "../axiosConfig";

export const businessApi = {
  getBusiness: () => axiosInstance.get("/business"),
};
