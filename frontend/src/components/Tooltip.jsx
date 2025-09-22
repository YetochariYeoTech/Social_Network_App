import React from 'react';

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full flex flex-col items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded-md">{text}</span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
      </div>
    </div>
  );
};

export default Tooltip;