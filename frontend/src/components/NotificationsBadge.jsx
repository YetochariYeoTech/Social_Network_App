import React, { useEffect, useState } from "react";
import { IoMdNotifications as Bell } from "react-icons/io";
import { FaUsers as Follower } from "react-icons/fa";
import { MdModeComment as Comment } from "react-icons/md";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import NotificationModal from "./NotificationModal";

function NotificationsBadge() {
  const styles = {
    countersStyles: "badge bg-neutral text-neutral-content rounded",
    iconsStyles: "w-6 h-6 transition-all duration-300",
  };
  const { authUser } = useAuthStore();
  const { unreadCounts, fetchUnreadNotifications } = useNotificationStore();
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);

  useEffect(() => {
    if (authUser && authUser.unreadNotifications) {
      fetchUnreadNotifications(authUser.unreadNotifications);
    }
  }, [authUser, fetchUnreadNotifications]);

  const likeNotifications = unreadCounts.LIKE || 0;
  const commentNotifications = unreadCounts.COMMENT || 0;

  const likes = ["User1 liked your post", "User2 liked your post"];
  const comments = [
    "User3 commented on your post",
    "User4 commented on your post",
  ];
  const followers = [
    "User5 started following you",
    "User6 started following you",
  ];

  return (
    <div className="flex flex-col bg-base-200 pl-1 pt-1 pb-1 shadow-md rounded-lg">
      <span className="font-bold mb-2">Notifications Center</span>
      <div className="flex justify-around">
        <button
          className="flex items-center tooltip tooltip-bottom hover:scale-105 transition-transform duration-100"
          data-tip="Likes"
          onClick={() => setLikesModalOpen(true)}
        >
          <Bell className={styles.iconsStyles} />
          <span className={styles.countersStyles}>{likeNotifications}</span>
        </button>
        <button
          className="flex items-center tooltip tooltip-bottom hover:scale-105 transition-transform duration-100"
          data-tip="Followers"
          onClick={() => setFollowersModalOpen(true)}
        >
          <Follower className={styles.iconsStyles} />
          <span className={styles.countersStyles}>140</span>
        </button>
        <button
          className="flex items-center tooltip tooltip-bottom hover:scale-105 transition-transform duration-100"
          data-tip="Comments"
          onClick={() => setCommentsModalOpen(true)}
        >
          <Comment className={styles.iconsStyles} />
          <span className={styles.countersStyles}>{commentNotifications}</span>
        </button>
      </div>
      <NotificationModal
        title="Likes"
        isOpen={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
      >
        <ul>
          {likes.map((like, index) => (
            <li key={index}>{like}</li>
          ))}
        </ul>
      </NotificationModal>
      <NotificationModal
        title="Comments"
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
      >
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </NotificationModal>
      <NotificationModal
        title="Followers"
        isOpen={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
      >
        <ul>
          {followers.map((follower, index) => (
            <li key={index}>{follower}</li>
          ))}
        </ul>
      </NotificationModal>
    </div>
  );
}

export default NotificationsBadge;
