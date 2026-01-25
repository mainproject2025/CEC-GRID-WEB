import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const AddHall = ({ onClose }) => {
  const [hallName, setHallName] = useState("");
  const [rows, setRows] = useState("");
  const [columns, setColumns] = useState("");
  const [status, setStatus] = useState("active");
  const [seatingType, setSeatingType] = useState("chair");

  const [openStatus, setOpenStatus] = useState(false);
  const [openSeating, setOpenSeating] = useState(false);

  // Capacity auto-calculated
  const capacity = rows && columns ? rows * columns : "";

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close dropdowns on outside click
  useEffect(() => {
    const closeDropdowns = () => {
      setOpenStatus(false);
      setOpenSeating(false);
    };
    window.addEventListener("click", closeDropdowns);
    return () => window.removeEventListener("click", closeDropdowns);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hallName || !rows || !columns) {
      alert("Please fill all required fields");
      return;
    }

    const hallData = {
      name: hallName,
      rows: Number(rows),
      columns: Number(columns),
      capacity: Number(capacity),
      status,
      seatingType,
    };

    try {
      const res = await fetch("http://localhost:5001/halls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hallData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onClose();
    } catch (err) {
      alert(err.message || "Failed to add hall");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 w-full max-w-md rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-Pmed text-slate-800">
            Add New Hall
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Hall Name */}
          <div>
            <label className="text-sm font-Pmed text-slate-600">
              Hall Name <span className="text-red-500">*</span>
            </label>
            <input
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Rows & Columns */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min={1}
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              placeholder="Rows"
              className="rounded-xl border border-slate-300 px-4 py-2.5
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            <input
              type="number"
              min={1}
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              placeholder="Columns"
              className="rounded-xl border border-slate-300 px-4 py-2.5
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Seating Type */}
          <div className="relative">
            <label className="text-sm font-Pmed text-slate-600">
              Seating Type
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenSeating(!openSeating);
              }}
              className="mt-2 w-full flex justify-between items-center rounded-xl border border-slate-300 px-4 py-2.5 hover:bg-slate-50"
            >
              <span className="capitalize">{seatingType}</span>
              <ChevronDown size={18} />
            </button>

            {openSeating && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                {["chair", "bench"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSeatingType(type);
                      setOpenSeating(false);
                    }}
                    className="w-full px-4 py-2.5 text-left capitalize hover:bg-slate-100"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="relative">
            <label className="text-sm font-Pmed text-slate-600">
              Status
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenStatus(!openStatus);
              }}
              className="mt-2 w-full flex justify-between items-center rounded-xl border border-slate-300 px-4 py-2.5 hover:bg-slate-50"
            >
              <span
                className={`font-Pmed ${
                  status === "active"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {status === "active" ? "Available" : "Maintenance"}
              </span>
              <ChevronDown size={18} />
            </button>

            {openStatus && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus("active");
                    setOpenStatus(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-emerald-600 hover:bg-emerald-50"
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus("inactive");
                    setOpenStatus(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-rose-600 hover:bg-rose-50"
                >
                  Maintenance
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-Pmed hover:bg-blue-700 active:scale-[0.98]"
            >
              Add Hall
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHall;
