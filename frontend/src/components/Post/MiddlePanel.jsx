import React from "react";
import NewPost from "./NewPost";
import PostList from "./PostList";

function MiddlePanel() {
  return (
    <div className="flex-col p-2 justify-center">
      <NewPost />
      <PostList />
    </div>
  );
}

export default MiddlePanel;
