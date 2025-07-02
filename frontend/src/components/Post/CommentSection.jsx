import React, { useEffect } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useCommentStore } from "../../store/useCommentStore";

const CommentSection = ({ postId, commentsCountSetter }) => {
  const {
    comments: commentsList,
    isLoading,
    fetchComments,
    resetComments,
    page,
    totalPages,
  } = useCommentStore();

  useEffect(() => {
    if (postId) {
      fetchComments(postId, true); // Fetch comments and reset when postId changes
    }
    return () => {
      resetComments(); // Clean up comments when component unmounts
    };
  }, [postId]);

  const handleLoadMore = () => {
    fetchComments(postId, false); // Load more comments without resetting
  };

  const increaseCommentCounter = () => {
    commentsCountSetter((prevCount) => prevCount + 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 bg-base-200 rounded-xl border border-base-300 shadow-sm">
      <h2 className="text-xl font-semibold text-base-content">Comments</h2>
      <CommentInput
        postId={postId}
        increasePostCommentsCounter={increaseCommentCounter}
      />
      <CommentList
        comments={commentsList}
        increasePostCommentsCounter={increaseCommentCounter}
      />
      {isLoading && <p>Loading more comments...</p>}
      {page < totalPages && !isLoading && (
        <button
          onClick={handleLoadMore}
          className="btn btn-primary w-full mt-4"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default CommentSection;
