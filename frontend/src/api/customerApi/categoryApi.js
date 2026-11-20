import axiosInstance from "../axiosConfig";

export const categoryApi = {
  getCategories: () => axiosInstance.get("/categories"),
};
