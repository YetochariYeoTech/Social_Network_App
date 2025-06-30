import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import eventEmitter from "../lib/events.js";
import { validationResult } from "express-validator";

// Helper function for consistent error responses
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Adds a post to the authenticated user's list of favorite posts.
 * Uses $addToSet to avoid duplicates.
 */
export const addToFavorites = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    // Ensure the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return sendErrorResponse(res, 404, "No post found with this ID");
    }

    // Add postId to user's favoritePosts array without duplication
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoritePosts: postId } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("addToFavorites error:", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

/**
 * Removes a post from the authenticated user's list of favorite posts.
 */
export const removeFromFavorites = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    // Ensure the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return sendErrorResponse(res, 404, "No post found with this ID");
    }

    // Remove postId from user's favoritePosts array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoritePosts: postId } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("removeFromFavorites error:", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

/**
 * Likes a post:
 * - Adds the post ID to user's likedPosts
 * - Adds user ID to post's likes array
 * - Increments post.likesCount
 * All done inside a transaction to keep data consistent.
 */
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) throw new Error("Post not found");

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    // Prevent duplicate likes
    if (user.likedPosts.includes(postId)) throw new Error("Post already liked");

    // Update both documents
    user.likedPosts.push(postId);
    await user.save({ session });

    post.likes.push(userId);
    post.likesCount += 1;
    await post.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    const updatedUser = await User.findById(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("likePost error:", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

/**
 * Unlikes a post:
 * - Removes postId from user's likedPosts
 * - Removes userId from post's likes
 * - Decrements likesCount (ensuring non-negative)
 * All done inside a transaction.
 */
export const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [post, user] = await Promise.all([
      Post.findById(postId).session(session),
      User.findById(userId).session(session),
    ]);

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return sendErrorResponse(res, 404, "Post not found");
    }
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return sendErrorResponse(res, 404, "User not found");
    }

    // Ensure post is currently liked
    if (!user.likedPosts.includes(postId)) {
      await session.abortTransaction();
      session.endSession();
      return sendErrorResponse(res, 400, "Post not liked yet");
    }

    // Remove likes from both sides
    user.likedPosts.pull(postId);
    await user.save({ session });

    post.likes.pull(userId);
    post.likesCount = Math.max(0, post.likesCount - 1);
    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updatedUser = await User.findById(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("unlikePost error:", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

/**
 * Creates a comment on a post:
 * - Saves the new comment
 * - Adds the comment ID to the post
 * - Increments post.commentsCount
 * Uses a transaction to ensure both models stay in sync.
 */
export const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, "Validation failed", errors.array());
  }

  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return sendErrorResponse(res, 404, "Post not found");
    }

    // Create the comment inside the transaction
    const comment = await Comment.create(
      [{ user: userId, post: postId, content }],
      { session }
    );

    // Update the post with the new comment
    post.comments.push(comment[0]._id);
    post.commentsCount += 1;
    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, comment: comment[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("createComment error:", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

/**
 * Deletes a comment:
 * - Validates ownership
 * - Deletes the comment
 * - Updates the post by removing the comment ID and decreasing commentsCount
 * Uses a transaction to ensure data consistency.
 */
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await Comment.findById(commentId).session(session);
    if (!comment) {
      await session.abortTransaction();
      session.endSession();
      return sendErrorResponse(res, 404, "Comment not found");
    }

    // Only the author can delete the comment
    if (!comment.user.equals(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    const post = await Post.findById(comment.post).session(session);
    if (post) {
      post.comments.pull(comment._id);
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save({ session });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json("Comment deleted successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("deleteComment error:", error.message);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};
