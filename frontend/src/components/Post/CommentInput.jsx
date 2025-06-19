import React, { useState } from "react";

const CommentInput = ({ onAddComment }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAddComment(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        className="textarea textarea-bordered w-full min-h-[50px]"
        placeholder="Add your comment..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></textarea>
      <button type="submit" className="btn btn-primary self-end">
        Post Comment
      </button>
    </form>
  );
};

export default CommentInput;
