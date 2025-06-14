import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const usePostStore = create((set, get) => ({
  creatingPost: false,
  loadingPosts: false,
  deletingPost: false,
  posts: [],

  // Get posts
  fetchPosts: async () => {
    set({ loadingPosts: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data });
    } catch (error) {
      toast.error("Failed to fetch posts");
      console.error("fetchPosts error:", error);
    } finally {
      set({ loadingPosts: false });
    }
  },

  // Create a new post
  createPost: async (data) => {
    set({ creatingPost: true });
    try {
      const res = await axiosInstance.post("/posts/createPost", data);
      const newPost = res.data.newPost;

      // Prepend new post to global post list
      set({ posts: [newPost, ...get().posts] });

      // ✅ Update authUser's posts using setState
      useAuthStore.setState((prev) => ({
        authUser: {
          ...prev.authUser,
          posts: [newPost._id, ...(prev.authUser?.posts || [])],
        },
      }));

      toast.success("Post created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      console.error("createPost error:", error);
    } finally {
      set({ creatingPost: false });
    }
  },

  //   Delete a post
  deletePost: async (postId) => {
    set({ deletingPost: true });
    try {
      await axiosInstance.delete(`/posts/deletePost/${postId}`);
      set({ posts: get().posts.filter((post) => post._id !== postId) });
      toast.success("Post deleted");

      // Update authUser's posts in authStore
      const authStore = useAuthStore.getState();
      const updatedUser = {
        ...authStore.authUser,
        posts: authStore.authUser.posts.filter((id) => id !== postId),
      };
      authStore.set({ authUser: updatedUser });
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("deletePost error:", error);
    } finally {
      set({ deletingPost: false });
    }
  },

  addToFavorites: async (postId) => {
    const authStore = useAuthStore.getState();
    const { authUser } = authStore;
    if (!authUser) return;

    try {
      const res = await axiosInstance.post(
        `/posts/actions/favorites/${postId}`
      );
      toast.success("Post added to favorites");

      // Update authUser with new data
      useAuthStore.setState({ authUser: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add to favorites"
      );
      console.error("addToFavorites error:", error);
    }
  },

  removeFromFavorites: async (postId) => {
    const authStore = useAuthStore.getState();
    const { authUser } = authStore;
    if (!authUser) return;

    try {
      const res = await axiosInstance.delete(
        `/posts/actions/favorites/${postId}`
      );
      toast.success("Post removed from favorites");

      // Update authUser with new data
      useAuthStore.setState({ authUser: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove from favorites"
      );
      console.error("removeFromFavorites error:", error);
    }
  },

  addToLiked: async (postId) => {
    const authStore = useAuthStore.getState();
    const { authUser } = authStore;
    if (!authUser) return;

    try {
      const res = await axiosInstance.post(`/posts/actions/likes/${postId}`);
      toast.success("Post liked");

      // Update authUser with new data
      useAuthStore.setState({ authUser: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to like this post");
      console.error("addToLiked error:", error);
    }
  },

  removeFromLiked: async (postId) => {
    const authStore = useAuthStore.getState();
    const { authUser } = authStore;
    if (!authUser) return;

    try {
      const res = await axiosInstance.delete(`/posts/actions/likes/${postId}`);
      toast.success("Post unliked");

      // Update authUser with new data
      useAuthStore.setState({ authUser: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to unlike this post"
      );
      console.error("removeFromLiked error:", error);
    }
  },
}));

// createPost: async (data) => {
//   set({ creatingPost: true });
//   try {
//     const res = await axiosInstance.post("/posts/createPost", data);
//     toast.success("Post created successfully");
//     console.log(res.data);
//     set({ posts: [res.data.newPost, ...get().posts] }); // This prepend the new post
//   } catch (error) {
//     toast.error(error.response?.data?.message || "Failed to create post");
//     console.error("createPost error:", error);
//   } finally {
//     set({ creatingPost: false });
//   }
// },

// deletePost: async (postId) => {
//   set({ deletingPost: true });
//   try {
//     await axiosInstance.delete(`/posts/deletePost/${postId}`);
//     set({ posts: get().posts.filter((post) => post._id !== postId) });
//     toast.success("Post deleted");
//   } catch (error) {
//     toast.error("Failed to delete post");
//     console.error("deletePost error:", error);
//   } finally {
//     set({ deletingPost: false });
//   }
// },
