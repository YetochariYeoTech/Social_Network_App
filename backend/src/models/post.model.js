import mongoose from "mongoose";

const postCategories = [
  "Technology",
  "Programming",
  "Design",
  "UX/UI",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
  "AI & Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Education",
  "Photography",
  "Marketing",
  "Productivity",
  "Management",
  "Personal Growth",
  "Entrepreneurship",
  "Science",
  "Finance",
  "Health & Wellness",
  "Travel",
  "Entertainment",
  "News",
  "Tutorial",
  "Case Study",
  "Opinion",
  "Announcement",
  "Note",
  "Undefined",
];

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    attachmentType: {
      type: String,
      enum: ["image", "document", "link", "text", null], // Accept onl one of those records
    },
    attachment: {
      type: String,
      default: null,
    },
    originalFileName: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: postCategories,
      default: "Undefined",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
