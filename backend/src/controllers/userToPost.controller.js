import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";

/**
 * @function addToFavorites
 * @description Adds a post ID to the authenticated user's list of favorite posts.
 *              Uses $addToSet to avoid duplicates in the favoritesPosts array.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.postId - The ID of the post to add to favorites
 * @param {Object} req.user - The authenticated user object (populated by middleware)
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Returns the updated user document or an error response
 *
 * @example
 * POST /api/favorites/:postId
 */
export const addToFavorites = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  console.log(req.params);

  try {
    // Let's verify that the post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "No post found with this ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { favoritePosts: postId },
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(
      "Error in auth.controller in addToFavorites() :",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function removeFromFavorites
 * @description Removes a post ID from the authenticated user's list of favorite posts.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.postId - The ID of the post to remove from favorites
 * @param {Object} req.user - The authenticated user object (populated by middleware)
 * @param {Object} res - Express response object
 *
 * @returns {Object} - Returns the updated user document or an error response
 *
 * @example
 * DELETE /api/favorites/:postId
 */
export const removeFromFavorites = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    // Optional: check if post exists (not required for removal logic)
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "No post found with this ID" });
    }

    // Remove the postId from the user's favoritesPosts array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoritePosts: postId } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in removeFromFavorites():", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function likePost
 * @description Adds a post to the user's likedPosts array and increments the post's likesCount,
 *              using a MongoDB transaction to ensure consistency.
 */
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already liked
    if (user.likedPosts.includes(postId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Post already liked" });
    }

    // Add to likedPosts
    user.likedPosts.push(postId);
    await user.save({ session });

    // Increment likes count
    post.likesCount += 1;
    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updatedUser = await User.findById(userId);

    res.status(200).json(updatedUser);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in likePost():", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function unlikePost
 * @description Removes a post from the user's likedPosts array and decrements the post's likesCount,
 *              using a MongoDB transaction to ensure consistency. Returns the updated user.
 */
export const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the post is actually liked by the user
    if (!user.likedPosts.includes(postId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Post not liked yet" });
    }

    // Remove postId from likedPosts
    user.likedPosts.pull(postId);
    await user.save({ session });

    // Decrement likesCount (but prevent negative values)
    post.likesCount = Math.max(0, post.likesCount - 1);
    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Fetch the updated user after transaction
    const updatedUser = await User.findById(userId);

    res.status(200).json(updatedUser);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(
      "Error in userToPost.controller unlikePost():",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
