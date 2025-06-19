// File: CommentSection.jsx
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      content: "This section is really informative. Thanks for sharing!",
      date: "2025-06-18 10:42 AM",
    },
    {
      id: 2,
      name: "Mark Smith",
      content: "Could you elaborate on the second point?",
      date: "2025-06-17 9:12 PM",
    },
  ]);

  const handleAddComment = (newContent) => {
    const newComment = {
      id: Date.now(),
      name: "You",
      content: newContent,
      date: new Date().toLocaleString(),
    };
    setComments([newComment, ...comments]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 bg-base-100 rounded-xl border border-base-300 shadow-sm">
      <h2 className="text-xl font-semibold text-base-content">Comments</h2>
      <CommentInput onAddComment={handleAddComment} />
      <CommentList comments={comments} />
    </div>
  );
};

export default CommentSection;
