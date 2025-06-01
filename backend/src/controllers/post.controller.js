import Post from "../models/post.model";

export const createPost = async (req, res) => {
  const { description, attachmentType, attachment } = req.body;
  const userId = req.user._id;
  try {
    // To be created, a post require description or attachment
    if (!description && !attachment) {
      return res.status(400).json({
        message: "You should fill description field or attach a file",
      });
    }

    const newPost = new Post({
      userId,
      description,
      attachmentType,
      attachment,
    });

    await newPost.save();

    res.status(201).json({ message: "New post published" });
  } catch (error) {
    console.log("Error in createPost controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPosts = async (req, res) => {};

export const getUserPosts = async (req, res) => {};

export const updatePost = async (req, res) => {};

export const deletePost = async (req, res) => {};
