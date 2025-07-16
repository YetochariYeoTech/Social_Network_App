import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const showError = (error) => {
  toast.error(error?.response?.data?.message || "Something went wrong");
};

export const useNotificationStore = create((set) => ({
  notifications: {},
  isFetching: false,
  unreadCounts: {},

  fetchNotifications: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data });
    } catch (error) {
      showError(error);
    } finally {
      set({ isFetching: false });
    }
  },

  fetchUnreadNotifications: async (notificationIds) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.post("/notifications/unread", {
        notificationIds,
      });
      set({ unreadCounts: res.data });
    } catch (error) {
      showError(error);
    } finally {
      set({ isFetching: false });
    }
  },
}));