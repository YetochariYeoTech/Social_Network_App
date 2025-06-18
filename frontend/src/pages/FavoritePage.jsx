// File: Favorite.jsx
import React, { useState } from "react";
import { favoritePosts, likedPosts } from "../data/postsData";
import PostGrid from "../components/Favorite/PostGrid";
import EmptyState from "../components/Favorite/EmptyState";
import TabToggle from "../components/Favorite/TabToggle";
import SearchBar from "../components/Favorite/Searchbar";

const FavoritePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("favorites");

  const currentPosts = activeTab === "favorites" ? favoritePosts : likedPosts;
  const categories = [
    "all",
    ...new Set(currentPosts.map((post) => post.category)),
  ];

  const filteredPosts = currentPosts.filter((post) => {
    const searchableText = [
      post.title || "",
      post.excerpt || "",
      post.author || "",
      ...(post.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-base-100 pt-20">
      <div className="border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-base-content mb-2">
                My Collection
              </h1>
              <p className="text-base-content/60">
                Your saved articles, PDFs, images, and notes
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-medium text-base-content">
                {currentPosts.length}
              </div>
              <div className="text-sm text-base-content/60">Total items</div>
            </div>
          </div>

          <TabToggle
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            favoriteCount={favoritePosts.length}
            likedCount={likedPosts.length}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          currentPosts={currentPosts}
          filteredPosts={filteredPosts}
        />

        {filteredPosts.length > 0 ? (
          <PostGrid posts={filteredPosts} activeTab={activeTab} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
