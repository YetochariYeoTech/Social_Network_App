// components/Post/PostSkeleton.jsx
import React from "react";

const PostSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white p-4 shadow-md space-y-4">
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-48 bg-gray-200 rounded-md"></div>
    </div>
  );
};

export default PostSkeleton;
