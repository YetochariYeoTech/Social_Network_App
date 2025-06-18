// File: components/SearchBar.jsx
import React from "react";
import { Search, Filter } from "lucide-react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  currentPosts,
  filteredPosts,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search your collection..."
            className="input input-bordered w-full pl-12 bg-base-100 border-base-300 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="sm:w-48">
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <select
            className="select select-bordered w-full pl-12 bg-base-100 border-base-300 focus:border-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(searchTerm || selectedCategory !== "all") && (
        <div className="sm:col-span-2">
          <p className="text-sm text-base-content/60">
            {filteredPosts.length} of {currentPosts.length} items
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
