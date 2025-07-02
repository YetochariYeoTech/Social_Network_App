import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCommentStore = create((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchComments: async (postId, reset = false) => {
    set({ isLoading: true, error: null });
    try {
      const pageToFetch = reset ? 1 : get().page;
      const res = await axiosInstance.get(
        `/posts/actions/${postId}/comments?page=${pageToFetch}`
      );

      set((state) => ({
        comments: reset
          ? res.data.comments
          : [...state.comments, ...res.data.comments],
        page: res.data.currentPage,
        totalPages: res.data.totalPages,
      }));
    } catch (error) {
      set({ error: "Failed to fetch comments" });
      toast.error("Failed to fetch comments");
      console.error("fetchComments error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addComment: async (postId, content) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post(
        `/posts/actions/${postId}/comments`,
        { content }
      );
      set((state) => ({
        comments: [res.data, ...state.comments],
      }));
      toast.success("Comment added successfully");
    } catch (error) {
      set({ error: "Failed to add comment", isLoading: false });
      toast.error("Failed to add comment");
      console.error("addComment error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetComments: () => {
    set({
      comments: [],
      page: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    });
  },
}));
