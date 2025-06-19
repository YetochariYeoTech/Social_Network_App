// File: components/CollectionSkeleton.jsx
import React from "react";

const SkeletonCard = () => (
  <div className="animate-pulse bg-base-100 border border-base-300 rounded-xl overflow-hidden">
    <div className="aspect-video bg-base-200" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-base-300 rounded w-3/4" />
      <div className="h-3 bg-base-300 rounded w-full" />
      <div className="h-3 bg-base-300 rounded w-5/6" />
      <div className="flex gap-2 mt-4">
        <div className="h-4 w-16 bg-base-300 rounded" />
        <div className="h-4 w-10 bg-base-300 rounded" />
      </div>
      <div className="flex justify-between text-xs text-base-content/50 pt-4">
        <div className="flex gap-2">
          <div className="h-3 w-16 bg-base-300 rounded" />
          <div className="h-3 w-12 bg-base-300 rounded" />
        </div>
        <div className="h-3 w-12 bg-base-300 rounded" />
      </div>
    </div>
  </div>
);

const CollectionSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default CollectionSkeleton;
