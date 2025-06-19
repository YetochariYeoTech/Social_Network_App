import React from "react";

const CommentList = ({ comments }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-base-200 p-4 rounded-lg border border-base-300"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-base-content">
              {comment.name}
            </span>
            <span className="text-xs text-base-content/60">{comment.date}</span>
          </div>
          <p className="text-base-content/80 whitespace-pre-line">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
