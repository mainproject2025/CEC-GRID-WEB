import React, { useState, useRef } from "react";
import { ArrowLeft, Upload, X, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useData } from "../context/DataContext";

const CreateSA = () => {
  const navigate = useNavigate();
  const { fetchExams, halls, fetchHalls } = useData();

  const [examName, setExamName] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [seatingType, setSeatingType] = useState("");
  const [selectedYears, setSelectedYears] = useState("");
  const [examDate, setExamDate] = useState("");
  const [semType, setSemType] = useState("Even");
  const [isSubmit, setisSubmit] = useState(false);
  const [hallDataSource, setHallDataSource] = useState("upload");
  const [arrangedHalls, setArrangedHalls] = useState([]);

  // Changed to array to support multiple files
  const [studentFiles, setStudentFiles] = useState([]);
  const [hallFile, setHallFile] = useState(null);

  const studentInputRef = useRef(null);
  const hallInputRef = useRef(null);

  const years = [1, 2, 3, 4];

  // Helper to check if multiple upload is allowed
  const isMultipleYears = selectedYears.length > 1;

  const handleYearToggle = (year) => {
    setSelectedYears((prev) => {
      const newYears = prev.includes(year)
        ? prev.filter((y) => y !== year)
        : [...prev, year];

      // Optional: If switching back to single year, keep only the first file
      if (newYears.length <= 1 && studentFiles.length > 1) {
        setStudentFiles([studentFiles[0]]);
      }
      return newYears;
    });
  };

  async function createNotification() {
    await fetch("http://localhost:5001/notification/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Exam Seating Generated",
        message: "Hall-wise seating arrangement is ready",
        type: "success",
      }),
    });
  }

  const moveHall = (index, direction) => {
    const newHalls = [...arrangedHalls];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newHalls.length) return;

    [newHalls[index], newHalls[targetIndex]] = [newHalls[targetIndex], newHalls[index]];
    setArrangedHalls(newHalls);
  };

  const shuffleHalls = () => {
    const shuffled = [...arrangedHalls].sort(() => Math.random() - 0.5);
    setArrangedHalls(shuffled);
  };

  const toggleHallSelection = (id) => {
    setArrangedHalls(prev => prev.map(h =>
      h.id === id ? { ...h, selected: !h.selected } : h
    ));
  };

  const convertHallsToCSV = (hallsData) => {
    if (!hallsData || hallsData.length === 0) return null;

    // Header
    const headers = ["name", "rows", "columns", "capacity"];
    const csvRows = [headers.join(",")];

    // Filter only active halls (should already be active if coming from arrangedHalls)
    const activeHalls = hallsData.filter(h => h.status === "active");

    activeHalls.forEach(hall => {
      const row = [
        hall.name,
        hall.rows,
        hall.columns,
        hall.capacity
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  };

  const handleFileUpload = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "student") {
      // Convert FileList to Array
      const newFiles = Array.from(files);

      if (isMultipleYears) {
        // In multiple mode, you might want to replace or append.
        // Here we replace the selection (standard input behavior)
        setStudentFiles(newFiles);
      } else {
        // In single mode, only take the first file
        setStudentFiles([newFiles[0]]);
      }
    } else {
      setHallFile(files[0]);
    }
  };

  const removeFile = (type, index = 0) => {
    if (type === "student") {
      const updatedFiles = studentFiles.filter((_, i) => i !== index);
      setStudentFiles(updatedFiles);

      // Reset input if all files removed
      if (updatedFiles.length === 0) {
        studentInputRef.current.value = "";
      }
    } else {
      setHallFile(null);
      hallInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Exam metadata
    formData.append("examName", examName);
    formData.append("seriesName", seriesName);
    formData.append("seatingType", seatingType);
    formData.append("years", JSON.stringify(selectedYears));
    formData.append("type", seatingType);
    formData.append("semType", semType);
    formData.append("examDate", examDate.toString()); // Keep toString() just in case



    // Handle Student Files (Single or Multiple)
    studentFiles.forEach((file) => {
      formData.append("students", file);
    });

    if (hallDataSource === "upload" && hallFile) {
      formData.append("halls", hallFile);
    } else if (hallDataSource === "management") {
      const activeHalls = halls.filter(h => h.status === "active");
      if (activeHalls.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No Active Halls",
          text: "Please add or activate halls in Hall Management first.",
        });
        setisSubmit(false);
        return;
      }
      const includedHalls = arrangedHalls.filter(h => h.selected);
      if (includedHalls.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No Halls Selected",
          text: "Please select at least one hall to include in the arrangement.",
        });
        setisSubmit(false);
        return;
      }
      const csvData = convertHallsToCSV(includedHalls);
      const blob = new Blob([csvData], { type: "text/csv" });
      const virtualFile = new File([blob], "halls_from_management.csv", { type: "text/csv" });
      formData.append("halls", virtualFile);
    }

    const handleResponse = async (response) => {
      if (!response.ok) {
        setisSubmit(false);
        Swal.fire({
          icon: "error",
          title: "Generation Failed",
          text: "Unable to generate seating arrangement PDFs.",
          confirmButtonColor: "#DC2626",
        });
      } else {
        setisSubmit(false);
        await createNotification();
        fetchExams(true); // Refresh exams list

        Swal.fire({
          icon: "success",
          title: "Seating Generated ",
          text: "Hall-wise seating arrangement has been generated successfully.",
          confirmButtonText: "Great!",
          confirmButtonColor: "#2D7FF9",
          background: "#F8FAFC",
        });
      }
    };

    try {
      if (selectedYears.length > 1 && seatingType === "Normal") {
        const response = await fetch("http://localhost:5001/TwoGenerateCommon", {
          method: "POST",
          body: formData,
        });
        await handleResponse(response);
      } else if (selectedYears.length == 1 && seatingType === "Normal") {
        const response = await fetch("http://localhost:5001/singleGenerateCommon", {
          method: "POST",
          body: formData,
        });
        await handleResponse(response);
      } else if (selectedYears.length > 1 && seatingType !== "Normal") {
        const response = await fetch("http://localhost:5001/TwoGenerateElective", {
          method: "POST",
          body: formData,
        });
        await handleResponse(response);
      } else {
        const response = await fetch("http://localhost:5001/singleGenerateElective", {
          method: "POST",
          body: formData,
        });
        await handleResponse(response);
      }
    } catch (err) {
      console.error(err);
      setisSubmit(false);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/app")}
            className="p-2 rounded-lg hover:bg-[#F1F5F9]"
          >
            <ArrowLeft size={22} className="text-[#737373]" />
          </button>

          <h1 className="text-[24px] font-Pmed text-gray-900">
            CREATE A NEW SEATING ARRANGEMENT
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E6E6E6] rounded-lg p-8">
          <div className="grid grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-9">
              {/* Series Name */}
              <div>
                <label className="block text-[#262626] font-Pmed mb-2">
                  Series Name (for Summary Printing) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="e.g. First Internal Examination"
                  className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9]"
                />
              </div>

              {/* Exam Name */}
              <div>
                <label className="block text-[#262626] font-Pmed mb-2">
                  Name of the exam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="Enter exam name"
                  className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9]"
                />
              </div>

              {/* Seating Type */}
              <div>
                <label className="block text-[#262626] font-Pmed mb-3">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  {["Normal", "Elective"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={seatingType === type}
                        onChange={() => {
                          setSeatingType(type);
                          if (type === "Normal") {
                            setEndDate("");
                          }
                        }}
                        className="accent-[#2D7FF9]"
                      />
                      <span className="font-Preg text-[#262626] capitalize">
                        {type} Exam
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years */}
              <div>
                <label className="block text-[#262626] font-Pmed mb-3">
                  Years <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearToggle(year)}
                      className={`px-6 py-2 rounded-lg text-[14px] font-Pmed transition-colors ${selectedYears.includes(year)
                        ? "bg-[#2D7FF9] text-white"
                        : "border border-[#E6E6E6] text-[#737373] hover:border-[#2D7FF9]"
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-[#262626] font-Pmed mb-3">
                    Exam Date
                  </label>
                  <input
                    type="datetime-local"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[#262626] font-Pmed mb-3">
                    Type of sem
                  </label>

                  <div className="flex items-center gap-6">
                    {["Even", "Odd"].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 font-Preg text-[#262626] capitalize"
                      >
                        <input
                          type="radio"
                          name="semType"
                          value={item}
                          checked={semType === item}
                          onChange={(e) => setSemType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-9">
              {/* Student File Upload */}
              <div>
                <label className="block text-[#262626] font-Pmed mb-2">
                  Student Details <span className="text-red-500">*</span>
                  {isMultipleYears && (
                    <span className="text-xs text-blue-500 ml-2">
                      (Multiple files allowed)
                    </span>
                  )}
                </label>

                <div
                  className={`border border-dashed rounded-lg px-6 py-4 text-center transition-colors relative
                  ${studentFiles.length > 0
                      ? "border-green-500 bg-green-50"
                      : "border-[#E6E6E6] hover:border-[#2D7FF9]"
                    }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    // Handle drag drop manually for array conversion
                    const droppedFiles = Array.from(e.dataTransfer.files);
                    if (droppedFiles.length > 0) {
                      if (isMultipleYears) setStudentFiles(droppedFiles);
                      else setStudentFiles([droppedFiles[0]]);
                    }
                  }}
                >
                  {studentFiles.length === 0 ? (
                    // EMPTY STATE
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={24} className="text-[#737373]" />

                      <p className="font-Pmed text-[#262626] text-[14px]">
                        Choose file{isMultipleYears ? "s" : ""} or drag & drop
                      </p>

                      <p className="text-[#737373] text-[12px] mb-2">
                        XLSX format, up to 20MB
                      </p>

                      <input
                        ref={studentInputRef}
                        type="file"
                        id="student-file"
                        accept=".xlsx,.xls,.csv"
                        multiple={isMultipleYears} // Conditional Multiple Attribute
                        onChange={(e) => handleFileUpload(e, "student")}
                        className="hidden"
                      />

                      <label
                        htmlFor="student-file"
                        className="px-4 py-1.5 border border-[#E6E6E6] rounded-lg text-[14px] cursor-pointer hover:bg-[#F1F5F9]"
                      >
                        Browse File{isMultipleYears ? "s" : ""}
                      </label>
                    </div>
                  ) : (
                    // FILLED STATE (List of files)
                    <div className="flex flex-col gap-2">
                      {studentFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white border border-green-500 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText
                              size={16}
                              className="text-green-600 shrink-0"
                            />
                            <span className="text-[14px] text-green-700 truncate">
                              {file.name}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFile("student", index)}
                            className="p-1 rounded hover:bg-green-100 shrink-0"
                          >
                            <X size={16} className="text-green-600" />
                          </button>
                        </div>
                      ))}

                      {/* Add more files button (Optional UX improvement) */}
                      <button
                        onClick={() => studentInputRef.current.click()}
                        className="text-xs text-green-700 hover:underline mt-1"
                      >
                        + Change selection
                      </button>
                      {/* Hidden Input needs to remain rendered to work with the button above */}
                      <input
                        ref={studentInputRef}
                        type="file"
                        id="student-file"
                        accept=".xlsx,.xls,.csv"
                        multiple={isMultipleYears}
                        onChange={(e) => handleFileUpload(e, "student")}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Hall Details */}
              <div className="space-y-4">
                <label className="block text-[#262626] font-Pmed">
                  Hall Details <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hallSource"
                      checked={hallDataSource === "upload"}
                      onChange={() => setHallDataSource("upload")}
                      className="accent-[#2D7FF9]"
                    />
                    <span className="font-Preg text-[#262626]">Upload CSV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hallSource"
                      checked={hallDataSource === "management"}
                      onChange={async () => {
                        setHallDataSource("management");
                        const res = await fetch("http://localhost:5001/halls");
                        const data = await res.json();
                        const activeHalls = (data.data || []).filter(h => h.status === "active");
                        // Add 'selected' property to each hall
                        const hallsWithSelection = activeHalls.map(h => ({ ...h, selected: true }));
                        setArrangedHalls(hallsWithSelection);
                      }}
                      className="accent-[#2D7FF9]"
                    />
                    <span className="font-Preg text-[#262626]">Use Hall Management</span>
                  </label>
                </div>

                {hallDataSource === "upload" ? (
                  <div
                    className={`border border-dashed rounded-lg px-6 py-4 text-center transition-colors
                    ${hallFile
                        ? "border-green-500 bg-green-50"
                        : "border-[#E6E6E6] hover:border-[#2D7FF9]"
                      }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) setHallFile(file);
                    }}
                  >
                    {!hallFile ? (
                      <div className="flex flex-col items-center gap-1">
                        <Upload size={24} className="text-[#737373]" />
                        <p className="font-Pmed text-[#262626] text-[14px]">
                          Choose a file or drag & drop
                        </p>
                        <p className="text-[#737373] text-[12px] mb-2">
                          XLSX format, up to 20MB
                        </p>
                        <input
                          ref={hallInputRef}
                          type="file"
                          id="hall-file"
                          accept=".xlsx,.xls,.csv"
                          onChange={(e) => handleFileUpload(e, "hall")}
                          className="hidden"
                        />
                        <label
                          htmlFor="hall-file"
                          className="px-4 py-1.5 border border-[#E6E6E6] rounded-lg text-[14px] cursor-pointer hover:bg-[#F1F5F9]"
                        >
                          Browse File
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white border border-green-500 rounded-lg px-4 py-2">
                        <span className="text-[14px] text-green-700 truncate">
                          {hallFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile("hall")}
                          className="p-1 rounded hover:bg-green-100"
                        >
                          <X size={16} className="text-green-600" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-Pmed text-blue-900 text-[14px]">
                              Using Hall Management Data
                            </p>
                            <p className="text-blue-700 text-[12px]">
                              {arrangedHalls.length} active halls selected
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={shuffleHalls}
                          className="px-3 py-1.5 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 font-Pmed flex items-center gap-2"
                        >
                          Random Arrangement
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto border border-[#E6E6E6] rounded-lg bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] border-b border-[#E6E6E6] sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-2 text-[12px] font-Pmed text-[#737373] w-12 text-center">Include</th>
                            <th className="px-4 py-2 text-[12px] font-Pmed text-[#737373] w-8">#</th>
                            <th className="px-4 py-2 text-[12px] font-Pmed text-[#737373]">Hall Name</th>
                            <th className="px-4 py-2 text-[12px] font-Pmed text-[#737373] text-right">Capacity</th>
                            <th className="px-4 py-2 text-[12px] font-Pmed text-[#737373] text-right">Cumulative</th>
                            <th className="px-4 py-2 text-[12px] font-Pmed text-[#737373] w-24 text-center">Reorder</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let cumulativeActual = 0;
                            return arrangedHalls.map((hall, index) => {
                              if (hall.selected) {
                                cumulativeActual += hall.capacity;
                              }
                              return (
                                <tr
                                  key={hall.id || index}
                                  className={`border-b border-[#E6E6E6] last:border-0 hover:bg-[#F8FAFC] transition-colors ${!hall.selected ? "opacity-50 grayscale" : ""}`}
                                >
                                  <td className="px-4 py-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={hall.selected}
                                      onChange={() => toggleHallSelection(hall.id)}
                                      className="accent-[#2D7FF9] w-4 h-4 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-[12px] font-Pmed text-[#737373]">
                                    {index + 1}.
                                  </td>
                                  <td className="px-4 py-3 text-[14px] font-Pmed text-[#262626]">
                                    {hall.name}
                                  </td>
                                  <td className="px-4 py-3 text-[14px] text-right text-[#262626] font-Pmed">
                                    {hall.capacity}
                                  </td>
                                  <td className="px-4 py-3 text-[14px] text-right text-[#2D7FF9] font-Pmed">
                                    {hall.selected ? cumulativeActual : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => moveHall(index, "up")}
                                        disabled={index === 0}
                                        className="p-1 rounded hover:bg-[#F1F5F9] disabled:opacity-30"
                                      >
                                        <ChevronUp size={16} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => moveHall(index, "down")}
                                        disabled={index === arrangedHalls.length - 1}
                                        className="p-1 rounded hover:bg-[#F1F5F9] disabled:opacity-30"
                                      >
                                        <ChevronDown size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-[#E6E6E6]">
            <button className="px-4 py-1 border border-[#2D7FF9] text-[#2D7FF9] rounded-lg font-Pmed hover:bg-[#F1F5FF]">
              Save
            </button>
            {isSubmit ? (
              <button className="px-4 py-1 bg-[#2D7FF9] text-white rounded-lg font-Pmed hover:bg-[#2750AE]">
                Generating ...
              </button>
            ) : (
              <button
                className="px-4 py-1 bg-[#2D7FF9] text-white rounded-lg font-Pmed hover:bg-[#2750AE]"
                onClick={(e) => {
                  e.preventDefault();
                  setisSubmit(true);
                  handleSubmit();
                }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSA;
