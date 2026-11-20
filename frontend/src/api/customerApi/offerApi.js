import axiosInstance from "../axiosConfig";

export const offerApi = {
  getOffers: () => axiosInstance.get("/offers"),
  validateOffer: (data) => axiosInstance.post("/offers/validate", data),
};
