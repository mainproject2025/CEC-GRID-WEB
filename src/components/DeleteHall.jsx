import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const DeleteHall = ({ hall, onClose, onDelete }) => {
  // Close on ESC
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!hall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6]">
          <h2 className="text-lg font-Pmed text-red-600">
            Delete Hall
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-start gap-5">
            <AlertTriangle className="text-red-500 mt-1" size={40} />
            <p className="text-[#262626] font-Pmed">
              Are you sure you want to delete{" "}
              <span className="font-bold">"{hall.name}"</span>?
            </p>
          </div>

          <p className="text-sm text-[#737373]">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t border-[#E6E6E6]">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-gray-900 text-gray-900 rounded-lg font-Pmed hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete(hall.id);
              onClose();
            }}
            className="px-4 py-1 bg-red-600 text-white rounded-lg font-Pmed hover:bg-red-700"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteHall;
