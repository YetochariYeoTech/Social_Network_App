import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCommentStore = create((set, get) => ({
  sendingComment: false,
  fetchingComments: false,
  deletingComments: false,
  comments: [],

  fetchComments: async (postId) => {
    set({ fetchingComments: true });
    try {
      const res = await axiosInstance.get(`/posts/${postId}/comments`);
      set({ comments: res.data });
    } catch (error) {
      toast.error("Failed to fetch this post comments");
      console.error("fetchComments error:", error);
    } finally {
      set({ fetchingComments: false });
    }
  },

  createComment: async (data) => {
    set({ sendingComment: true });
    try {
      await axiosInstance.post(`/posts/${postId}/actions/comments`, data);

      toast.success("Comment sent successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while creating the comment.";
      toast.error(message);
    } finally {
      set({ sendingComment: false });
    }
  },

  deleteComment: async (postId, commentId) => {
    set({ deletingComments: false });
    try {
      await axiosInstance.delete(
        `/posts/${postId}/actions/comments/${commentId}`
      );

      toast.success("Comment removed successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while deleting the comment.";
      toast.error(message);
    }
  },
}));
