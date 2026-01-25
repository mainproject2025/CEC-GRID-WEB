import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Download,
  Clock,
  FileText,
  SquareCheck,
} from "lucide-react";

import SA from "../assets/images/SA-PLAN IMG.svg";
import { DualRingSpinner, GradientBar } from "../components/Loaders";

const SeatingArrangements = () => {
  const [showAll, setShowAll] = useState(false);
  const [seatingActivities, setseatingActivities] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("https://cec-grd-backend.onrender.com/FetchExamDetails");

        if (!res.ok) throw new Error("Failed to fetch exams");

        const data = await res.json();

        setseatingActivities(data.exams); // ✅ correct
      } catch (err) {
        console.error(err);
      }
    };

    fetchExams();
  }, []);

  const togglePublishExam = async (examId, value) => {
    try {
      const res = await fetch(
        `https://cec-grd-backend.onrender.com/FetchExamDetails/${examId}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublished: value }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      console.log("Publish updated:", value);
    } catch (err) {
      console.error("Publish failed:", err.message);
    }
  };

  const downloadPdfs = async (examId, isElective) => {
    console.log(isElective);
    if (!isElective) {
      try {
        const res = await fetch("https://cec-grd-backend.onrender.com/MakePdfCommon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId }),
        });

        if (!res.ok) {
          throw new Error("Failed to download ZIP");
        }

        // ✅ IMPORTANT: use blob(), NOT json()
        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `Exam_${examId}_PDFs.zip`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    } else {
      try {
        const res = await fetch("https://cec-grd-backend.onrender.com/GeneratePdfElective", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId }),
        });

        if (!res.ok) {
          throw new Error("Failed to download ZIP");
        }

        // ✅ IMPORTANT: use blob(), NOT json()
        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `Exam_${examId}_PDFs.zip`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    }
  };

  const displayedActivities = showAll
    ? seatingActivities
    : seatingActivities.slice(0, 2);

  console.log(displayedActivities);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-Pmed">SEATING ARRANGEMENTS</h1>
          <div className="w-full h-px bg-[#737373]" />
        </div>

        {/* Create Card */}
        <div className="bg-white rounded-lg border border-[#E6E6E6] p-8 mb-8">
          <div className="flex items-center justify-between">
            {/* Left Content */}
            <div className="flex-1">
              <h2 className="text-[24px] font-Pmed text-gray-900 mb-1">
                Create a new seating arrangement
              </h2>

              <p className="text-[14px] text-[#737373] font-Preg mb-14">
                Design your perfect seating layout in minutes
              </p>

              <button
                onClick={() => navigate("/app/create-sa")}
                className="flex items-center gap-2 bg-[#2D7FF9] hover:bg-[#2750AE] text-white font-Pmed px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Create
              </button>
            </div>

            {/* Right Image */}
            <div className="ml-8">
              <img
                src={SA}
                alt="Seating plan illustration"
                className="w-auto h-40 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-[#737373]" />
            <h2 className="text-[18px] font-Pmed text-[#262626]">
              Recent activity
            </h2>
          </div>

          <div className="space-y-4">
            {displayedActivities.length != 0 ? (
              displayedActivities.map((activity) => (
                <div
                  key={activity.Examid}
                  className="bg-white border border-[#E6E6E6] rounded-lg p-6"
                >
                  <div className="flex justify-between items-start">
                    {/* Left Content */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FileText size={18} className="text-[#737373]" />
                        <h3 className="font-Pmed text-[#262626]">
                          {activity.examName}
                        </h3>
                      </div>

                      <div className="flex gap-2 mb-3 flex-wrap">
                        {JSON.parse(activity.sems).map((sem) => (
                          <span
                            key={sem}
                            className="px-3 py-1 bg-[#F1F5F9] text-[#262626] rounded text-[13px] font-Preg"
                          >
                            {sem}
                          </span>
                        ))}
                      </div>

                      <p className="text-[14px] text-[#737373] font-Preg">
                        Exam Date :{activity.createdAt}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {!activity.isPublished ? (
                        <button
                          className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#2D7FF9] text-[#2D7FF9] rounded-lg hover:bg-[#F1F5FF] transition-colors"
                          onClick={() => {
                            togglePublishExam(activity.examId);
                          }}
                        >
                          <Eye size={16} />
                          Publish
                        </button>
                      ) : (
                        <p className="flex items-center cursor-not-allowed gap-2 px-4 py-2 border border-[#11ff25] text-[#11ff25] rounded-lg hover:bg-[#F1F5FF] transition-colors">
                          <SquareCheck size={16} />
                          Published
                        </p>
                      )}

                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-[#2D7FF9] text-white rounded-lg hover:bg-[#2750AE] transition-colors"
                        onClick={() => {
                          console.log(activity.examId);

                          downloadPdfs(activity.examId, activity.isElective);
                        }}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nothing to Show </p>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[#737373] hover:text-[#262626] font-Pmed"
              >
                {showAll ? "Show less" : "View all"}
              </button>
            </div>
          </div>

          {/* View All */}
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangements;
