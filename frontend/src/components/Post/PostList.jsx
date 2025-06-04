import React, { useEffect } from "react";
import Post from "./Post";
import { usePostStore } from "../../store/usePostStore";

function PostList() {
  const { posts, loadingPosts, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component mounts
    console.log(posts);
  }, []);
  return (
    <div className="mt-2 flex flex-col gap-3 overflow-y-scroll overflow-x-hidden h-screen p-2">
      {/* Loading posts screen */}
      {loadingPosts && <p>Loading posts...</p>}
      {/* No posts found screen */}
      {!loadingPosts && posts.length === 0 && <p>No posts found.</p>}
      {/* Render the posts */}
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
}

export default PostList;
