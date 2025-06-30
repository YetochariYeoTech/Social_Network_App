import React, { useEffect } from "react";
import Post from "./Post";
import { usePostStore } from "../../store/usePostStore";
import PostSkeleton from "../skeletons/PostSkeleton";

function PostList() {
  const { posts, loadingPosts, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
    console.log(posts); // Fetch posts when the component mounts
  }, []);

  return (
    <div className="mt-2 flex flex-col gap-3 overflow-y-scroll overflow-x-hidden h-screen p-2">
      {/* Loading posts screen */}
      {loadingPosts &&
        Array.from({ length: 3 }).map((_, idx) => <PostSkeleton key={idx} />)}
      {/* No posts found screen */}
      {posts.length === 0 && (
        <p>
          There is not posts for the moment. Please check later or refresh the
          page.
        </p>
      )}
      {/* Render the posts */}
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
}

export default PostList;
