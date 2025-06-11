import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

const showError = (error) => {
  toast.error(error?.response?.data?.message || "Something went wrong");
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      showError(error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      showError(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      showError(error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      toast.success("Profile updated successfully");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in update profile:", error);
      showError(error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  addToFavorites: async (postId) => {
    const { authUser } = get();
    if (!authUser) return;
    try {
      const res = await axiosInstance.post(
        `/posts/actions/favorites/${postId}`
      );
      toast.success("Post added to favorites");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in adding to favorites:", error);
      showError(error);
    }
  },

  removeFromFavorites: async (postId) => {
    const { authUser } = get();
    if (!authUser) return;
    try {
      const res = await axiosInstance.delete(
        `/posts/actions/favorites/${postId}`
      );
      toast.success("Post remkoved from favorites");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in adding to favorites:", error);
      showError(error);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // disconnectSocket: () => {
  //   if (get().socket?.connected) get().socket.disconnect();
  // },
}));
