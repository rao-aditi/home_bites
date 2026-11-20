import axiosInstance from "../axiosConfig";

export const notificationApi = {
  getNotifications: () => axiosInstance.get("/notifications"),
  markNotificationRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
};
