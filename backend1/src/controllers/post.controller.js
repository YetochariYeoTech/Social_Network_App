import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

// Helper function for consistent error responses
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, "Validation failed", errors.array());
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { description, attachmentType, attachment, originalFileName } =
      req.body;
    const userId = req.user._id;

    // Validate input
    if (!description && !attachment) {
      return sendErrorResponse(
        res,
        400,
        "Please provide a description or an attachment."
      );
    }

    // Prepare post data
    const postData = {
      user: userId,
      description,
      attachmentType,
      originalFileName,
    };

    // Handle cloudinary upload if there's an attachment
    if (attachment) {
      try {
        const uploadRes = await cloudinary.uploader.upload(attachment);
        postData.attachment = uploadRes.secure_url;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);
        return sendErrorResponse(res, 500, "Error uploading file");
      }
    }

    // Save post in transaction
    const newPost = await new Post(postData).save({ session });

    // Push post ID to user's Posts array
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: { $each: [newPost._id], $position: 0 } } },
      { session }
    );

    await session.commitTransaction();

    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "fullName profilePic"
    );

    return res.status(201).json({ newPost: populatedPost });
  } catch (error) {
    await session.abortTransaction();

    console.error("Error in createPost controller:", error.message);
    return sendErrorResponse(res, 500, "Internal server error");
  } finally {
    session.endSession();
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * This function helps to get list of recent posts
 * or oldest post based on a date
 */
export const getPosts = async (req, res) => {
  try {
    const { date } = req.query;

    // Conditional mongoose query building
    const query = date ? { createdAt: { $lt: new Date(date) } } : {};

    // Now let's fetch the post using the prebuild query
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "fullName profilePic"); // This attach the user details to the post

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in post.controller.js - getPosts:", error);
    sendErrorResponse(res, 500, "Failed to fetch posts");
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 *
 * This funmctions deletes a post after checking that the user is owner
 */
export const deletePost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { postId } = req.params;
    const user = req.user._id;

    const post = await Post.findById(postId).session(session);

    if (!post) {
      return sendErrorResponse(res, 404, "Post not found");
    }

    if (post.user.toString() !== user.toString()) {
      return sendErrorResponse(
        res,
        403,
        "You are not allowed to delete this post"
      );
    }

    await post.deleteOne({ session });

    await User.findByIdAndUpdate(user, { $pull: { posts: postId } }).session(
      session
    );

    await session.commitTransaction();

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.log(`Error in postController - deletePost : ${error.message}`);
    res.status(500).json({ message: "Failed to delete post" });
  } finally {
    session.endSession();
  }
};
