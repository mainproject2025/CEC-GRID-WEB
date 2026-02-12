import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomVisualizer from "./RoomVisualizer";
import { useData } from "../context/DataContext";

const ViewHall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { halls, loadingHalls, fetchHalls } = useData();

  const [hall, setHall] = useState(null);

  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  useEffect(() => {
    if (halls.length > 0) {
      const found = halls.find((h) => h.id === id);
      setHall(found || null);
    }
  }, [halls, id]);

  const loading = loadingHalls && !hall;
  // Should show loading if fetching and we don't have the hall. 
  // If we have the hall (maybe from previous fetch), we can show it immediately even if re-fetching in background?
  // Current logic: loadingHalls is true on fetch. 

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading hall...
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p>Hall not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded shadow"
      >
        ← Back
      </button>

      <RoomVisualizer hallsData={[hall]} />
    </div>
  );
};

export default ViewHall;
