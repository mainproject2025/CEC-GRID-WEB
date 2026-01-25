import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoomVisualizer from "./RoomVisualizer";

const ViewHall = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const res = await fetch(`http://localhost:5001/halls`);
        const json = await res.json();

        const found = json.data.find((h) => h.id === id);
        setHall(found || null);
      } catch (err) {
        console.error("Failed to fetch hall", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

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
