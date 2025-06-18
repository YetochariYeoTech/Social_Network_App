// File: components/PostGrid.jsx
import React from "react";
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Tag,
  ExternalLink,
  User,
  Bookmark,
  Heart,
} from "lucide-react";

const getPostIcon = (type) => {
  switch (type) {
    case "image":
      return <ImageIcon className="w-4 h-4" />;
    case "pdf":
      return <FileText className="w-4 h-4" />;
    case "note":
      return <Tag className="w-4 h-4" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

const getPostTypeLabel = (type) => {
  switch (type) {
    case "image":
      return "Image";
    case "pdf":
      return "PDF";
    case "note":
      return "Note";
    default:
      return "Article";
  }
};

const getPostTypeColor = (type) => {
  switch (type) {
    case "image":
      return "badge-info";
    case "pdf":
      return "badge-error";
    case "note":
      return "badge-warning";
    default:
      return "badge-success";
  }
};

const PostGrid = ({ posts, activeTab }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group bg-base-100 border border-base-300 rounded-xl overflow-hidden hover:shadow-lg hover:border-base-400 transition-all duration-200"
        >
          {post.image ? (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title || "Content image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : post.type === "pdf" ? (
            <div className="aspect-video bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center border-b border-base-300">
              <FileText className="w-12 h-12 text-red-500 mb-2" />
              <span className="text-sm font-medium text-red-700">
                PDF Document
              </span>
              {post.fileSize && (
                <span className="text-xs text-red-600 mt-1">
                  {post.fileSize}
                </span>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-base-200 flex items-center justify-center border-b border-base-300">
              <div className="text-center">
                {getPostIcon(post.type)}
                <div className="text-xs text-base-content/50 mt-1">
                  {getPostTypeLabel(post.type)}
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {post.title && (
                  <h3 className="font-medium text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                )}
                {post.excerpt && (
                  <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center">
                  {activeTab === "favorites" ? (
                    <Bookmark className="w-4 h-4 text-primary fill-current" />
                  ) : (
                    <Heart className="w-4 h-4 text-error fill-current" />
                  )}
                </div>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="badge badge-ghost badge-sm">
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="badge badge-ghost badge-sm">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-base-content/50">
              <div className="flex items-center gap-4">
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {post.readTime && <span>{post.readTime}</span>}
                <span
                  className={`badge badge-outline badge-xs ${getPostTypeColor(post.type)}`}
                >
                  {getPostTypeLabel(post.type)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
