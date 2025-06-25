// components/Post/PostSkeleton.jsx
import React from "react";

const PostSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg bg-base-200 p-4 shadow-md space-y-4">
      <div className="h-4 bg-base-content rounded w-1/3"></div>
      <div className="h-4 bg-base-content rounded w-2/3"></div>
      <div className="h-48 bg-base-content rounded-md"></div>
    </div>
  );
};

export default PostSkeleton;
