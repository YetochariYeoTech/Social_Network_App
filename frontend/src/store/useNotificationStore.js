import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"; // To get the socket

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  getNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/notifications"); // Assuming a /notifications endpoint
      set({
        notifications: res.data,
        unreadCount: res.data.filter((notif) => !notif.read).length, // Assuming a 'read' property
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notifications.");
    } finally {
      set({ isLoading: false });
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`); // Assuming an endpoint to mark as read
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        ),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark notification as read.");
    }
  },

  subscribeToNotifications: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newNotification", (newNotification) => {
      set((state) => ({
        notifications: [newNotification, ...state.notifications], // Add new notification to the top
        unreadCount: state.unreadCount + 1, // Increment unread count
      }));
      toast.success("New notification!"); // Optional: show a toast
    });
  },

  unsubscribeFromNotifications: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newNotification");
    }
  },

  // Potentially add a clearAllNotifications or markAllAsRead action later if needed
}));
