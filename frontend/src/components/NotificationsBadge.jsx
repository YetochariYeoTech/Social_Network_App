import React from "react";
import { IoMdNotifications as Bell } from "react-icons/io";
import { FaUsers as Follower } from "react-icons/fa";
import { MdModeComment as Comment } from "react-icons/md";

function NotificationsBadge() {
  const styles = {
    countersStyles: "badge bg-neutral text-neutral-content rounded",
    iconsStyles: "w-6 h-6 transition-all duration-300",
  };

  return (
    <div className="flex flex-col bg-base-200 pl-1 pt-1 pb-1 shadow-md rounded-lg">
      <span className="font-bold mb-2">Notifications Center</span>
      <div className="flex justify-around">
        <button
          className="flex items-center tooltip tooltip-bottom"
          data-tip="Likes"
        >
          <Bell className={styles.iconsStyles} />
          <span className={styles.countersStyles}>0</span>
        </button>
        <button
          className="flex items-center tooltip tooltip-bottom"
          data-tip="Followers"
        >
          <Follower className={styles.iconsStyles} />
          <span className={styles.countersStyles}>140</span>
        </button>
        <button
          className="flex items-center tooltip tooltip-bottom"
          data-tip="Comments"
        >
          <Comment className={styles.iconsStyles} />
          <span className={styles.countersStyles}>21</span>
        </button>
      </div>
    </div>
  );
}

export default NotificationsBadge;
