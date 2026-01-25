import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  AlertTriangle,
  View,
} from "lucide-react";
import AddHall from "../components/AddHall";
import EditHall from "../components/EditHall";
import DeleteHall from "../components/DeleteHall";



/* SORT OPTIONS */
const SORT_OPTIONS = [
  { key: "nameAsc", label: "Name (A–Z)" },
  { key: "nameDesc", label: "Name (Z–A)" },
  { key: "capAsc", label: "Capacity (Low to High)" },
  { key: "capDesc", label: "Capacity (High to Low)" },
  { key: "statusAvailable", label: "Status (Available First)" },
  { key: "statusMaintenance", label: "Status (Maintenance First)" },
];

const HallManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("nameAsc");
  const [openSort, setOpenSort] = useState(false);

  const [hallsData, setHallsData] = useState([]);

  // 🔑 Firestore IDs are strings → start empty
  const [selectedHalls, setSelectedHalls] = useState([]);

  const [showAddHall, setShowAddHall] = useState(false);
  const [editHall, setEditHall] = useState(null);
  const [viewHall, setViewHall] = useState(null);
  const [deleteHall, setDeleteHall] = useState(null);

  /* =========================
        FETCH HALLS
  ========================== */
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("http://localhost:5001/halls");
        const data = await res.json();
        setHallsData(data.data || []);
      } catch (err) {
        console.error("Failed to fetch halls", err);
      }
    };

    fetchHalls();
  }, []);

  /* Auto select all halls after fetch (same behavior as before) */
  useEffect(() => {
    if (hallsData.length) {
      setSelectedHalls(hallsData.map((h) => h.id));
    }
  }, [hallsData]);

  /* =========================
        SEARCH
  ========================== */
  const filteredHalls = useMemo(() => {
    return hallsData.filter((h) =>
      `${h.name} ${h.capacity} ${h.rows} ${h.columns} ${h.status}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, hallsData]); // ✅ FIXED

  /* =========================
        SORT
  ========================== */
  const sortedHalls = useMemo(() => {
    const data = [...filteredHalls];

    switch (sortBy) {
      case "nameAsc":
        return data.sort((a, b) => a.name.localeCompare(b.name));
      case "nameDesc":
        return data.sort((a, b) => b.name.localeCompare(a.name));
      case "capAsc":
        return data.sort((a, b) => a.capacity - b.capacity);
      case "capDesc":
        return data.sort((a, b) => b.capacity - a.capacity);
      case "statusAvailable":
        return data.sort((a, b) => a.status.localeCompare(b.status));
      case "statusMaintenance":
        return data.sort((a, b) => b.status.localeCompare(a.status));
      default:
        return data;
    }
  }, [filteredHalls, sortBy]);

  /* =========================
        STATS (LOGIC FIX ONLY)
  ========================== */
  const totalHalls = hallsData.length;

  const activeHalls = hallsData.filter(
    (h) => selectedHalls.includes(h.id) && h.status === "active",
  ).length;

  const totalCapacity = hallsData
    .filter((h) => selectedHalls.includes(h.id))
    .reduce((sum, h) => sum + h.capacity, 0);

  const avgCapacity = activeHalls ? Math.round(totalCapacity / activeHalls) : 0;

  /* =========================
        MAINTENANCE WARNING
  ========================== */
  const selectedMaintenanceHalls = hallsData.filter(
    (h) => selectedHalls.includes(h.id) && h.status === "inactive",
  );

  /* =========================
        CHECKBOX HANDLERS
  ========================== */
  const handleSelectAll = (e) => {
    setSelectedHalls(e.target.checked ? sortedHalls.map((h) => h.id) : []);
  };

  const handleSelectHall = (id) => {
    setSelectedHalls((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-[24px] font-Pmed">HALL MANAGEMENT</h1>
          <div className="w-full h-px bg-[#737373]" />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Halls", value: totalHalls },
            { label: "Active Halls", value: activeHalls },
            { label: "Active Capacity", value: totalCapacity },
            { label: "Average Active Capacity", value: avgCapacity },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-[#E6E6E6] rounded-lg p-6"
            >
              <p className="text-[#737373] text-sm font-Pmed mb-2">
                {item.label}
              </p>
              <p className="text-[28px] font-Pmed text-[#262626]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ⚠ MAINTENANCE WARNING */}
        {selectedMaintenanceHalls.length > 0 && (
          <div className="mb-8 flex items-center gap-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-4">
            <AlertTriangle className="text-[#EA580C] mt-1" size={30} />
            <div>
              <p className="font-Pmed text-[#9A3412]">
                Maintenance hall(s) selected
              </p>
              <p className="text-sm text-[#9A3412]">
                {selectedMaintenanceHalls.map((h) => h.name).join(", ")} are
                currently under maintenance and should not be used for exams.
              </p>
            </div>
          </div>
        )}

        {/* SEARCH + ACTIONS */}
        {/* ⬇⬇⬇ UI BELOW IS UNCHANGED ⬇⬇⬇ */}
        {/* (rest of your JSX remains exactly the same) */}

        {/* SEARCH + ACTIONS */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]"
            />
            <input
              type="text"
              placeholder="search by name, building or capacity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border bg-white border-[#E6E6E6] rounded-lg focus:outline-none focus:border-[#2D7FF9]"
            />
          </div>

          {/* SORT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 px-4 py-2 border border-[#E6E6E6] rounded-lg bg-white hover:bg-[#F8FAFC]"
            >
              <ArrowUpDown size={18} />
              <span className="font-Pmed">Sort</span>
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E6E6E6] rounded-xl shadow-lg z-20">
                <p className="px-4 py-3 text-xs text-[#737373] font-Pmed border-b">
                  SORT BY
                </p>

                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSortBy(opt.key);
                      setOpenSort(false);
                    }}
                    className="w-full px-4 py-2 flex justify-between hover:bg-[#F8FAFC]"
                  >
                    <span className="font-Pmed">{opt.label}</span>
                    {sortBy === opt.key && (
                      <span className="text-[#2D7FF9] font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddHall(true)}
            className="flex items-center gap-2 bg-[#2D7FF9] hover:bg-[#2750AE] text-white font-Pmed px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add new hall
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#E6E6E6] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F2F2F2] border-b border-[#E6E6E6]">
              <tr>
                <th className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedHalls.length === sortedHalls.length &&
                        sortedHalls.length > 0
                      }
                      onChange={handleSelectAll}
                      className="accent-[#2D7FF9] scale-180"
                    />
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-Preg">Hall Name</th>
                <th className="px-6 py-4 text-left font-Preg">Capacity</th>
                <th className="px-6 py-4 text-left font-Preg">Layout</th>
                <th className="px-6 py-4 text-left font-Preg">Status</th>
                <th className="px-6 py-4 text-left font-Preg">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedHalls.map((hall) => (
                <tr
                  key={hall.id}
                  className="border-b border-[#E6E6E6] hover:bg-[#F8FAFC]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedHalls.includes(hall.id)}
                        onChange={() => handleSelectHall(hall.id)}
                        className="accent-[#2D7FF9] scale-180"
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 font-Pmed">{hall.name}</td>
                  <td className="px-6 py-4 text-[#737373]">
                    {hall.capacity} seats
                  </td>
                  <td className="px-6 py-4 text-[#737373]">
                    {hall.rows} × {hall.columns}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-Pmed ${
                        hall.status === "active"
                          ? "bg-[#E6F4EA] text-[#137333]"
                          : "bg-[#FDECEC] text-[#B3261E]"
                      }`}
                    >
                      {hall.status === "active" ? "Available" : "Maintenance"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/halls/view/${hall.id}`)}
                        className="p-2 hover:bg-[#F1F5F9] rounded"
                      >
                        <View size={16} />
                      </button>

                      <button
                        onClick={() => setEditHall(hall)}
                        className="p-2 hover:bg-[#F1F5F9] rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteHall(hall)}
                        className="p-2 hover:bg-[#FFECEC] rounded"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showAddHall && <AddHall onClose={() => setShowAddHall(false)} />}
        {editHall && (
          <EditHall
            hall={editHall}
            onClose={() => setEditHall(null)}
            onUpdate={(updatedHall) => {
              setHallsData((prev) =>
                prev.map((h) => (h.id === updatedHall.id ? updatedHall : h)),
              );
            }}
          />
        )}

        {deleteHall && (
          <DeleteHall
            hall={deleteHall}
            onClose={() => setDeleteHall(null)}
            onDelete={async (id) => {
              try {
                await fetch(`http://localhost:5001/halls/${id}`, {
                  method: "DELETE",
                });

                // Remove deleted hall from state
                setHallsData((prev) => prev.filter((h) => h.id !== id));

                // Also remove from selected halls
                setSelectedHalls((prev) => prev.filter((hid) => hid !== id));
              } catch (err) {
                console.error("Failed to delete hall", err);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HallManagement;
