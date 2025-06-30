import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";
import Comment from "../models/comment.model.js";

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
      return res.status(404).json({ message: "No post found with this ID" });
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
    res.status(500).json({ message: "Internal Server Error" });
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
      return res.status(404).json({ message: "No post found with this ID" });
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
    res.status(500).json({ message: "Internal Server Error" });
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
    res
      .status(error.message === "Post already liked" ? 400 : 404)
      .json({ message: error.message });
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
    const post = await Post.findById(postId).session(session);
    if (!post) throw new Error("Post not found");

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    // Ensure post is currently liked
    if (!user.likedPosts.includes(postId)) {
      throw new Error("Post not liked yet");
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
    res
      .status(error.message === "Post not liked yet" ? 400 : 404)
      .json({ message: error.message });
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
      return res.status(404).json({ message: "Post not found" });
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

    res.status(201).json(comment[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("createComment error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
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
      return res.status(404).json({ message: "Comment not found" });
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

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("deleteComment error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// import User from "../models/user.model.js";
// import Post from "../models/post.model.js";
// import mongoose from "mongoose";

// /**
//  * @function addToFavorites
//  * @description Adds a post ID to the authenticated user's list of favorite posts.
//  *              Uses $addToSet to avoid duplicates in the favoritesPosts array.
//  *
//  * @param {Object} req - Express request object
//  * @param {Object} req.params - Route parameters
//  * @param {string} req.params.postId - The ID of the post to add to favorites
//  * @param {Object} req.user - The authenticated user object (populated by middleware)
//  * @param {Object} res - Express response object
//  *
//  * @returns {Object} - Returns the updated user document or an error response
//  *
//  * @example
//  * POST /api/favorites/:postId
//  */
// export const addToFavorites = async (req, res) => {
//   const { postId } = req.params;
//   const userId = req.user._id;

//   console.log(req.params);

//   try {
//     // Let's verify that the post exists
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: "No post found with this ID" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         $addToSet: { favoritePosts: postId },
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log(
//       "Error in auth.controller in addToFavorites() :",
//       error.message
//     );
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /**
//  * @function removeFromFavorites
//  * @description Removes a post ID from the authenticated user's list of favorite posts.
//  *
//  * @param {Object} req - Express request object
//  * @param {Object} req.params - Route parameters
//  * @param {string} req.params.postId - The ID of the post to remove from favorites
//  * @param {Object} req.user - The authenticated user object (populated by middleware)
//  * @param {Object} res - Express response object
//  *
//  * @returns {Object} - Returns the updated user document or an error response
//  *
//  * @example
//  * DELETE /api/favorites/:postId
//  */
// export const removeFromFavorites = async (req, res) => {
//   const { postId } = req.params;
//   const userId = req.user._id;

//   try {
//     // Optional: check if post exists (not required for removal logic)
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "No post found with this ID" });
//     }

//     // Remove the postId from the user's favoritesPosts array
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { favoritePosts: postId } },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("Error in removeFromFavorites():", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /**
//  * @function likePost
//  * @description Adds a post to the user's likedPosts array and increments the post's likesCount,
//  *              using a MongoDB transaction to ensure consistency.
//  */
// export const likePost = async (req, res) => {
//   const { postId } = req.params;
//   const userId = req.user._id;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const post = await Post.findById(postId).session(session);
//     if (!post) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if already liked
//     if (user.likedPosts.includes(postId)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "Post already liked" });
//     }

//     // Add to likedPosts
//     user.likedPosts.push(postId);
//     await user.save({ session });

//     // Increment likes count
//     post.likesCount += 1;
//     post.likes.push(userId);
//     await post.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     const updatedUser = await User.findById(userId);

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error in likePost():", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /**
//  * @function unlikePost
//  * @description Removes a post from the user's likedPosts array and decrements the post's likesCount,
//  *              using a MongoDB transaction to ensure consistency. Returns the updated user.
//  */
// export const unlikePost = async (req, res) => {
//   const { postId } = req.params;
//   const userId = req.user._id;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const post = await Post.findById(postId).session(session);
//     if (!post) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the post is actually liked by the user
//     if (!user.likedPosts.includes(postId)) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: "Post not liked yet" });
//     }

//     // Remove postId from likedPosts
//     user.likedPosts.pull(postId);
//     await user.save({ session });

//     // Decrement likesCount (but prevent negative values)
//     post.likesCount = Math.max(0, post.likesCount - 1);
//     post.likes.pull(userId);
//     await post.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     // Fetch the updated user after transaction
//     const updatedUser = await User.findById(userId);

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(
//       "Error in userToPost.controller unlikePost():",
//       error.message
//     );
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
