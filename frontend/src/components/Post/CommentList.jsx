import React, { useEffect } from "react";
import { formatCreatedAt } from "../../lib/utils";

const CommentList = ({ comments }) => {
  // useEffect(() => {
  //   // console.log(comments);
  // }, [comments]);

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div
          key={comment._id || index}
          className="bg-base-100 p-4 rounded-lg border border-base-300"
        >
          <div className="flex flex-row gap-2 items-center mb-1">
            <img
              src={comment.user.profilePic || "/avatar.png"}
              alt="Profile Pic"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col font-semibold text-base-content">
              <span>{comment.user.fullName}</span>
              <span className="text-xs text-base-content/60 ml-auto italic">
                {formatCreatedAt(comment.createdAt)}
              </span>
            </div>
            <div className=""></div>
          </div>
          <p className="ml-10 text-base-content/80 whitespace-pre-line">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
