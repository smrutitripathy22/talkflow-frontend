import React, { useEffect, useRef } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const MessageAlert = ({
  type = "success",
  message,
  onClose,
  duration = 3000,
}) => {
  const alertRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const baseStyles =
    "px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2 shadow-lg";

  const typeStyles = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
  };

  const icons = {
    success: <FiCheckCircle className="text-green-600 text-lg" />,
    error: <FiXCircle className="text-red-600 text-lg" />,
  };

  return (
    <div
      ref={alertRef}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className={`${baseStyles} ${typeStyles[type]}`}>
        {icons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default MessageAlert;
