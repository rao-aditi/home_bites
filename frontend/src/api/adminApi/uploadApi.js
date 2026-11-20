import axiosInstance from "../axiosConfig";

export const adminUploadApi = {
  // multipart: axios sets the boundary itself for FormData
  uploadImages: (files) => {
    const body = new FormData();
    files.forEach((f) => body.append("images", f));
    return axiosInstance.post("/admin/upload", body);
  },
};
