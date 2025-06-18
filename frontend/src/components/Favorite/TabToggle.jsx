// File: components/TabToggle.jsx
import React from "react";
import { Bookmark, ThumbsUp } from "lucide-react";

const TabToggle = ({ activeTab, setActiveTab, favoriteCount, likedCount }) => {
  return (
    <div className="tabs tabs-boxed bg-base-200 p-1 w-fit">
      <button
        className={`tab tab-lg px-6 ${activeTab === "favorites" ? "tab-active" : ""}`}
        onClick={() => setActiveTab("favorites")}
      >
        <Bookmark className="w-4 h-4 mr-2" />
        Favorites ({favoriteCount})
      </button>
      <button
        className={`tab tab-lg px-6 ${activeTab === "liked" ? "tab-active" : ""}`}
        onClick={() => setActiveTab("liked")}
      >
        <ThumbsUp className="w-4 h-4 mr-2" />
        Liked ({likedCount})
      </button>
    </div>
  );
};

export default TabToggle;
