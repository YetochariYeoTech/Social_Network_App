import React, { useEffect, useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaComment, FaBookmark } from "react-icons/fa";

import { FaShareNodes } from "react-icons/fa6";
import { BiSolidLike } from "react-icons/bi";
// Stores import
import { useAuthStore } from "../../store/useAuthStore";
import { usePostStore } from "../../store/usePostStore";
// Animated UI components
import TiltedCard from "../animatedUI/TiltedCard";
import CommentSection from "./CommentSection";
import { Button, Menu, Portal } from "@chakra-ui/react";

const iconsClasses =
  "h-5 w-5 cursor-pointer transition duration-200 hover:scale-110";

function Post({ post }) {
  function postPublishedOn() {
    if (!post.createdAt) return "Unknown date";

    const date = new Date(post.createdAt);

    if (isNaN(date.getTime())) return "Unknown date"; // Invalid date fallback

    return date.toISOString().split("T")[0];
  }

  if (!post) return null;
  return (
    <>
      {post && (
        <div className="flex flex-col p-2 gap-4 bg-base-200 text-base-content rounded-lg shadow-md">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <img
                src={post.user?.profilePic || "/avatar.png"}
                className="h-12 w-12 object-cover rounded-full"
                alt="Profile"
              />
              <span>
                <h3 className="font-bold">{post.user?.fullName}</h3>
                <p className="italic text-sm">
                  published on {postPublishedOn()}
                </p>
              </span>
            </div>
            <ActionModal postId={post.postId} />
          </div>
          <p>{post.description && post.description}</p>
          <div className="">
            {post.attachmentType === "image" && (
              <div className="w-full bg-base-300 rounded-lg">
                <TiltedCard
                  imageSrc={`${post.attachment}`}
                  altText={`${post.attachment}`}
                  scaleOnHover={1.01}
                  rotateAmplitude={1}
                />
                {/* <img
                  src={`${post.attachment}`}
                  className="max-h-72 rounded-lg mx-auto"
                  alt=""
                  srcset=""
                /> */}
              </div>
            )}
          </div>
          <PostFooter
            postId={post._id}
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
          />
        </div>
      )}
    </>
  );
}

function PostFooter({ postId, likesCount, commentsCount }) {
  const [postStatus, setPostStatus] = useState({
    isLiked: false,
    isFavorite: false,
  });
  const [likes, setLikes] = useState(likesCount);
  const { authUser } = useAuthStore();
  const { addToFavorites, removeFromFavorites, addToLiked, removeFromLiked } =
    usePostStore();

  useEffect(() => {
    const isFavorite = authUser?.favoritePosts?.includes(postId);
    const isLiked = authUser?.likedPosts?.includes(postId);

    setPostStatus((prev) => ({
      ...prev,
      isFavorite: isFavorite,
      isLiked: isLiked,
    }));
  }, [authUser, postId]);

  async function handleFavoriteAction() {
    const isFavorite = (authUser?.favoritePosts ?? []).includes(postId);
    // If the post is already added to favorites, we remove it from the collection
    if (isFavorite) {
      await removeFromFavorites(postId);
      setPostStatus((prev) => {
        return { ...prev, isFavorite: false };
      });
      return;
    }
    // In case it doesn't exist in favorites, we add it
    await addToFavorites(postId);
    setPostStatus((prev) => ({ ...prev, isFavorite: true }));
    return;
  }

  async function handleLikeAction() {
    const isLiked = (authUser?.likedPosts ?? []).includes(postId);
    // If the post is already added to liked, we remove it from the collection
    if (isLiked) {
      await removeFromLiked(postId);
      setPostStatus((prev) => {
        return { ...prev, isLiked: false };
      });
      setLikes((count) => Math.max(0, count - 1));
      return;
    }
    // In case it doesn't exist in liked, we add it
    await addToLiked(postId);
    setPostStatus((prev) => ({ ...prev, isLiked: true }));
    setLikes((count) => count + 1);
    return;
  }

  return (
    <div className="flex justify-between">
      <span className="flex gap-3">
        <span className="flex gap-1">
          <BiSolidLike
            className={`${iconsClasses} ${postStatus.isLiked ? "text-blue-400" : ""}`}
            onClick={handleLikeAction}
          />
          {likes}
        </span>
        <span className="flex gap-1">
          <FaComment
            className={iconsClasses}
            onClick={() => document.getElementById("my_modal_1").showModal()}
          />
          {commentsCount || 0}
        </span>
        <FaShareNodes className={iconsClasses} />
      </span>
      <FaBookmark
        className={`${iconsClasses} transition-colors duration-100 ${postStatus.isFavorite ? "text-blue-400" : ""}`}
        onClick={handleFavoriteAction}
      />
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box max-w-3xl w-full">
          <div className="flex justify-between mb-3">
            <h3 className="text-lg font-bold mb-4">Comments</h3>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
          ,
          <CommentSection />
          <div className="modal-action"></div>
        </div>
      </dialog>
    </div>
  );
}

function ActionModal({ postId = null }) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <MdOutlineMoreHoriz className="h-8 w-8 cursor-pointer" />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt-a">Repost</Menu.Item>
            <Menu.Item value="new-file-a">Report</Menu.Item>
            <Menu.Item value="new-win-a">Delete</Menu.Item>
            <Menu.Item value="open-file-a">Open File...</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default Post;
