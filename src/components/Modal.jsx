import React from "react";

const Modal = ({ isOpen, setOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Glass Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white  p-4 rounded-xl shadow-xl max-w-lg w-full mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
