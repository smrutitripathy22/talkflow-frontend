import React from "react";

const Tooltip = ({ children, label }) => (
  <div className="relative group flex items-center">
    {children}
    <div className="absolute left-14 z-10 w-max scale-0 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
      {label}
    </div>
  </div>
);

export default Tooltip;
