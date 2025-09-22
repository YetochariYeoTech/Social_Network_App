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

  incrementUnreadCount: (notificationType) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [notificationType]: (state.unreadCounts[notificationType] || 0) + 1,
      },
    }));
  },

  decrementUnreadCount: (notificationType) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [notificationType]: Math.max(0, (state.unreadCounts[notificationType] || 0) - 1),
      },
    }));
  },

  markAsRead: async (notificationType) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [notificationType]: 0,
      },
    }));
    try {
      await axiosInstance.post("/notifications/read", { notificationType });
    } catch (error) {
      showError(error);
    }
  },
}));