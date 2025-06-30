import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import eventEmitter from "../lib/events.js";

/**
 * @desc Create a new comment
 * @route POST /api/comments
 * @access Private
 */
export const createComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { postId, content } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId).session(session);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      user: userId,
      post: postId,
      content,
    });

    await comment.save({ session });

    post.comments.unshift(comment._id);
    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Emit newComment event for notification
    eventEmitter.emit("newComment", { comment, postAuthor: post.user });

    res.status(201).json(comment);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get all comments for a post
 * @route GET /api/comments/post/:postId
 * @access Public
 */
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: postId }).populate(
      "user",
      "fullName profilePic"
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Update a comment
 * @route PUT /api/comments/:commentId
 * @access Private
 */
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the owner of the comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Delete a comment
 * @route DELETE /api/comments/:commentId
 * @access Private
 */
export const deleteComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId).session(session);

    if (!comment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Not authorized" });
    }

    const post = await Post.findById(comment.post).session(session);
    if (post) {
      post.comments.pull(comment._id);
      await post.save({ session });
    }

    await comment.remove({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Comment removed" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error });
  }
};
