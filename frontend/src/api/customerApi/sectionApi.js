import axiosInstance from "../axiosConfig";

export const sectionApi = {
  getSections: () => axiosInstance.get("/homepage-sections"),
};
