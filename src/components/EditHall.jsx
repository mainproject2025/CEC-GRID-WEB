import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const EditHall = ({ hall, onClose ,onUpdate}) => {
  const [hallName, setHallName] = useState("");
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [status, setStatus] = useState("active");
  const [openStatus, setOpenStatus] = useState(false);

  // ✅ capacity derived from rows × columns
  const capacity = rows && columns ? rows * columns : "";

  // Prefill data when modal opens
  useEffect(() => {
    if (hall) {
      setHallName(hall.name);
      setRows(hall.rows);
      setColumns(hall.columns);
      setStatus(hall.status);
    }
  }, [hall]);

  // Close on ESC
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!hallName || !rows || !columns) return;

  const updatedHall = {
    name: hallName,
    rows: Number(rows),
    columns: Number(columns),
    capacity: Number(capacity),
    status,
  };

  try {
    await fetch(`http://localhost:5001/halls/${hall.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedHall),
    });

    // Update parent state
    onUpdate({ ...hall, ...updatedHall });

    onClose();
  } catch (err) {
    console.error("Failed to update hall", err);
  }
};


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
          <h2 className="text-lg font-Pmed">Edit Hall</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Hall Name */}
          <div>
            <label className="font-Pmed text-sm">
              Hall Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              className="mt-2 w-full rounded-lg px-4 py-2 border border-[#E6E6E6] text-[#262626] placeholder-[#737373] outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9] hover:border-[#2D7FF9]"
            />
          </div>

          {/* Rows & Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-Pmed text-sm">
                No of Rows <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="mt-2 w-full rounded-lg px-4 py-2 border border-[#E6E6E6] text-[#262626] placeholder-[#737373] outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9] hover:border-[#2D7FF9]"
              />
            </div>

            <div>
              <label className="font-Pmed text-sm">
                No of Columns <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                className="mt-2 w-full rounded-lg px-4 py-2 border border-[#E6E6E6] text-[#262626] placeholder-[#737373] outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9] hover:border-[#2D7FF9]"
              />
            </div>
          </div>

          {/* Capacity (auto-calculated) */}
          <div>
            <label className="font-Pmed text-sm">
              Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={capacity}
              readOnly
              className="mt-2 w-full border border-[#E6E6E6] bg-[#F8FAFC] rounded-lg px-4 py-2 cursor-not-allowed"
            />
          </div>

          {/* Capacity info */}
          <p className="text-sm text-[#737373]">
            Capacity will be automatically calculated as{" "}
            <span className="font-Pmed">{capacity || 0}</span>
          </p>

          {/* Status */}
          <div>
            <label className="font-Pmed text-sm">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setOpenStatus(!openStatus)}
                className="w-full flex items-center justify-between border border-[#E6E6E6] text-[#262626] placeholder-[#737373] outline-none focus:border-[#2D7FF9] focus:ring-1 focus:ring-[#2D7FF9] hover:border-[#2D7FF9] rounded-lg px-4 py-2"
              >
                <span
                  className={`font-Pmed ${
                    status === "active" ? "text-[#137333]" : "text-[#B3261E]"
                  }`}
                >
                  {status === "active" ? "Available" : "Maintenance"}
                </span>
                <ChevronDown size={18} />
              </button>

              {openStatus && (
                <div className="absolute mt-2 w-full bg-white border border-[#E6E6E6] rounded-lg shadow-lg z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("active");
                      setOpenStatus(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#E6F4EA] text-[#137333]"
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("inactive");
                      setOpenStatus(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[#FDECEC] text-[#B3261E]"
                  >
                    Maintenance
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4 border-t border-[#E6E6E6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 border border-[#2D7FF9] text-[#2D7FF9] rounded-lg font-Pmed hover:bg-[#F1F5FF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-[#2D7FF9] text-white rounded-lg font-Pmed hover:bg-[#2750AE]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHall;
