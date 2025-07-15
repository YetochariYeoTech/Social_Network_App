import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const showError = (error) => {
  toast.error(error?.response?.data?.message || "Something went wrong with events");
};

export const useEventStore = create((set, get) => ({
  events: [],
  isFetchingEvents: false,
  isCreatingEvent: false,
  hasListener: false, // Flag to prevent duplicate listeners

  // Action to fetch initial events
  fetchEvents: async () => {
    set({ isFetchingEvents: true });
    try {
      const res = await axiosInstance.get("/events");
      set({ events: res.data });
    } catch (error) {
      showError(error);
    } finally {
      set({ isFetchingEvents: false });
    }
  },

  // Action to create a new event
  createEvent: async (eventData) => {
    set({ isCreatingEvent: true });
    try {
      await axiosInstance.post("/events", eventData);
      // No need to manually add the event here, the socket listener will do it
      toast.success("Event created successfully!");
      return true; // Indicate success
    } catch (error) {
      showError(error);
      return false; // Indicate failure
    } finally {
      set({ isCreatingEvent: false });
    }
  },

  // Action to add a new event received from socket
  addEvent: (newEvent) => {
    set((state) => ({
      events: [newEvent, ...state.events],
    }));
    toast.success("A new event has been created!");
  },

  // Action to set up the socket listener
  listenForEvents: () => {
    if (get().hasListener) return;

    const { socket } = useAuthStore.getState();

    if (socket) {
      socket.on("newEvent", (newEvent) => {
        get().addEvent(newEvent);
      });
      set({ hasListener: true });
    } else {
        console.warn("Socket not available when trying to listen for events.")
    }
  },
  
  // Action to clean up the listener
  cleanupListener: () => {
      const { socket } = useAuthStore.getState();
      if (socket && get().hasListener) {
          socket.off("newEvent");
          set({ hasListener: false });
      }
  }
}));