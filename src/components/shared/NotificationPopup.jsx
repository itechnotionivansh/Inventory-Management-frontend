import React from "react";

export default function NotificationPopup({ message, type = "info", onClose }) {
  if (!message) return null;
  const base =
    "fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white flex items-center transition-all duration-300";
  const typeStyles = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
  };
  return (
    <div className={`${base} ${typeStyles[type] || typeStyles.info}`}>
      <span className="flex-1">{message}</span>
      <button
        className="ml-4 text-lg font-bold focus:outline-none"
        onClick={onClose}
        aria-label="Close notification">
        ×
      </button>
    </div>
  );
}
