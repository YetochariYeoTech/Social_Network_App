import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

//     req.body;
//   const user = req.user._id;
//   try {
//     // To be created, a post require description or attachment
//     if (!description && !attachment) {
//       return res.status(400).json({
//         message: "You should fill description field or attach a file",
//       });
//     }

//     const data = {
//       user,
//       description,
//       attachmentType,
//       attachment,
//       originalFileName,
//     };

//     if (attachment) {
//       const uploadResponse = await cloudinary.uploader.upload(attachment);
//       data.attachment = uploadResponse.secure_url;
//     }

//     const newPost = new Post(data);

//     let savedPost = await newPost.save();
//     savedPost = await savedPost.populate("user", "fullName profilePic");
//     res.status(201).json({ newPost: savedPost });
//   } catch (error) {
//     console.log("Error in createPost controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const createPost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { description, attachmentType, attachment, originalFileName } =
      req.body;
    const userId = req.user._id;

    // Validate input
    if (!description && !attachment) {
      return res.status(400).json({
        message: "Please provide a description or an attachment.",
      });
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
      const uploadRes = await cloudinary.uploader.upload(attachment);
      postData.attachment = uploadRes.secure_url;
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
    return res.status(500).json({ error: "Internal server error" });
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
    const { date } = req.body;

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
    res.status(500).json({ message: "Failed to fetch posts" });
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
  try {
    const { postId } = req.params;
    const user = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString !== userId.toString) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error in postController - deletePost : ${error.message}`);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// export const createPost = async (req, res) => {
//   const { description, attachmentType, attachment, originalFileName } =
