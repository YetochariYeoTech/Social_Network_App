import React, { useState } from "react";
import { useCommentStore } from "../../store/useCommentStore";

const CommentInput = ({ postId, increasePostCommentsCounter }) => {
  const [content, setContent] = useState("");
  const { addComment, isLoading } = useCommentStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addComment(postId, content);
    increasePostCommentsCounter();
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        className="textarea textarea-bordered w-full min-h-[50px]"
        placeholder="Add your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      ></textarea>
      <button
        type="submit"
        className="btn bg-primary text-primary-content self-end"
        disabled={isLoading}
      >
        {isLoading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentInput;
