import React from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaComment, FaRegBookmark } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { MdOutlineFavorite } from "react-icons/md";

// Animated UI components
import TiltedCard from "../animatedUI/TiltedCard";

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
        <div className="flex flex-col p-2 gap-2 bg-neutral rounded-lg">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <img
                src={post.user?.profilePic}
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
            <MdOutlineMoreHoriz className="h-8 w-8 cursor-pointer" />
          </div>
          <p>{post.description && post.description}</p>
          <div className="">
            {post.attachmentType === "image" && (
              <div className="w-full bg-black/30 backdrop-blur-sm rounded-lg">
                <TiltedCard
                  imageSrc={`${post.attachment}`}
                  altText={`${post.attachment}`}
                  scaleOnHover={1.02}
                  rotateAmplitude={5}
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
          <div className="flex justify-between">
            <span className="flex gap-3">
              <span className="flex gap-1">
                <MdOutlineFavorite className={iconsClasses} />
                {post?.likesCount}
              </span>
              <span className="flex gap-1">
                <FaComment className={iconsClasses} />
                {post?.likesCount}
              </span>
              <FaShareNodes className={iconsClasses} />
            </span>
            <FaRegBookmark className={iconsClasses} />
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
