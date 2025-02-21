import React, { useEffect } from "react";
import { X } from "lucide-react";

const Notification = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor =
    type === "success" ? "border-green-200" : "border-red-200";

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 ${bgColor} ${textColor} p-4 rounded-lg border ${borderColor} shadow-lg`}
    >
      <div className="flex items-center">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
