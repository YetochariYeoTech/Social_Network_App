// File: components/EmptyState.jsx

import React from "react";
import { Search } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
          <Search className="w-8 h-8 text-base-content/30" />
        </div>
        <h3 className="text-lg font-medium text-base-content mb-2">
          No items found
        </h3>
        <p className="text-base-content/60 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
