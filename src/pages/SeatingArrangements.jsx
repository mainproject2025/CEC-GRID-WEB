import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Download,
  Clock,
  FileText,
  SquareCheck,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

import SA from "../assets/images/SA-PLAN IMG.svg";
import { DualRingSpinner, GradientBar } from "../components/Loaders";
import { useData } from "../context/DataContext";
// ...
const SeatingArrangements = () => {
  const { exams, loadingExams, errorExams, fetchExams } = useData();

  const [showAll, setShowAll] = useState(false);
  // mapping context exams to local var 'seatingActivities' to keep rest of code same
  const seatingActivities = exams;
  // Use context loading/error, but mapped to local names if needed
  const loading = loadingExams;
  const error = errorExams;

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);


  const togglePublishExam = async (examId, value) => {
    try {
      const res = await fetch(
        `https://cec-grd-backend.onrender.com//FetchExamDetails/${examId}/publish`,
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



  const handleDeleteExam = async (examId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Assuming your backend supports DELETE /deleteExam/:id
        const response = await fetch(`https://cec-grd-backend.onrender.com//deleteExam/${examId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await Swal.fire("Deleted!", "The exam has been deleted.", "success");
          fetchExams(true); // Refresh list
        } else {
          try {
            // Fallback attempt with FetchExamDetails if first fails (common pattern guess)
            const res2 = await fetch(`https://cec-grd-backend.onrender.com//deleteExam/${examId}`, { method: 'DELETE' });
            if (res2.ok) {
              await Swal.fire("Deleted!", "The exam has been deleted.", "success");
              fetchExams(true);
              return;
            }
          } catch (e) { }

          throw new Error("Failed to delete exam");
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error!", "Failed to delete the exam. Ensure backend supports deletion.", "error");
    }
  };

  const downloadPdfs = async (examId, isElective) => {
    try {
      /* =============================
         1️⃣ FETCH SAVED HTML
      ============================= */

      const url = isElective
        ? "https://cec-grd-backend.onrender.com//GeneratePdfElective"
        : "https://cec-grd-backend.onrender.com//MakePdfCommon";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });

      if (!res.ok) throw new Error("Failed to fetch HTML");

      const data = await res.json();

      const halls = data.halls || data.rooms;
      const summary = data.summary || data.summaryHtml;

      if (!halls || !summary) {
        throw new Error("Invalid HTML");
      }

      /* =============================
         OPEN PRINT WINDOW
      ============================= */

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Popup blocked. Allow popups.");
        return;
      }

      /* =============================
         HELPER: CHECK IF HALL HAS DATA
      ============================= */

      const hasContent = (html) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        // Get visible text
        const text = temp.textContent.replace(/\s+/g, "");

        return text.length > 50; // threshold
      };

      /* =============================
         BUILD DOCUMENT
      ============================= */

      let fullHtml = `
      <html>
      <head>
        <title>Exam ${examId}</title>

        <style>
          @media print {
            body {
              margin: 20mm;
              font-family: Arial;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            tr, td, th {
              page-break-inside: avoid;
            }

            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>

      <body>
    `;

      let pageCount = 0;

      /* =============================
         ADD NON-EMPTY HALLS
      ============================= */

      for (const hallName of Object.keys(halls)) {
        const html = halls[hallName];

        // Skip empty halls
        if (!hasContent(html)) {
          console.log("Skipping empty hall:", hallName);
          continue;
        }

        // Page break except first
        if (pageCount > 0) {
          fullHtml += `<div class="page-break"></div>`;
        }

        fullHtml += `
        ${html}
      `;

        pageCount++;
      }

      /* =============================
         ADD SUMMARY (IF EXISTS)
      ============================= */

      if (hasContent(summary)) {
        if (pageCount > 0) {
          fullHtml += `<div class="page-break"></div>`;
        }

        fullHtml += `
        ${summary}
      `;
      }

      fullHtml += `
      </body>
      </html>
    `;

      /* =============================
         PRINT
      ============================= */

      printWindow.document.open();
      printWindow.document.write(fullHtml);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF");
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#737373]" />
              <h2 className="text-[18px] font-Pmed text-[#262626]">
                Recent activity
              </h2>
            </div>
            <button
              onClick={() => fetchExams(true)}
              className="text-sm text-[#2D7FF9] hover:underline font-Pmed"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-4">

            {loading ? (
              <div className="flex justify-center p-8">
                <DualRingSpinner />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                Error: {error}
              </div>
            ) : displayedActivities.length > 0 ? (
              displayedActivities.map((activity) => (
                <div
                  key={activity.examId || activity.Examid}
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
                        {activity.sems && JSON.parse(activity.sems).map((sem) => (
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
                            navigate(`/customize/${activity.examId}`);
                          }}
                        >
                          <Eye size={16} />
                          Customize
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
                          downloadPdfs(activity.examId, activity.isElective);
                        }}
                      >
                        <Download size={16} />
                        Download
                      </button>

                      <button
                        className="flex items-center gap-2 px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={() => handleDeleteExam(activity.examId)}
                        title="Delete Exam"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nothing to Show</p>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[#737373] hover:text-[#262626] font-Pmed"
              >
                {showAll ? "Show less" : "View all"}
              </button>
            </div>


            {/* View All */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangements;
