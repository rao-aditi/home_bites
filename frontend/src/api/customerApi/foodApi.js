import axiosInstance from "../axiosConfig";

export const foodApi = {
  getFoods: (params) => axiosInstance.get("/foods", { params }),
  getFood: (id) => axiosInstance.get(`/foods/${id}`),
};
