import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Plus, Edit2, UserPlus, GripVertical } from "lucide-react";
import Swal from "sweetalert2";

const CustomizeSeating = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [examData, setExamData] = useState(null);
    const [halls, setHalls] = useState([]);
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [students, setStudents] = useState([]); // All students for this exam
    const [unallocatedStudents, setUnallocatedStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [draggedStudent, setDraggedStudent] = useState(null);

    // Edit Student Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: "", rollNo: "" });

    // Add Student Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: "", rollNo: "" });


    useEffect(() => {
        fetchExamData();
    }, [examId]);

    const fetchExamData = async () => {
        try {
            setLoading(true);
            // API call to fetch exam details
            const res = await fetch(`https://cec-grd-backend.onrender.com/fetchDetails/${examId}`);
            const data = await res.json();
            console.log("Fetched Exam Data:", data);

            if (data && data.success) {
                const apiExam = {
                    id: data.examId || examId,
                    name: data.name || "Exam",
                    date: data.examDate || "Date",
                    halls: []
                };

                const apiHalls = [];


                // key is the hall name like "301", "302"
                // value is the hall object with rows, columns, type, row0, row1...
                const hallKeys = Object.keys(data["exam"].halls || {});


                hallKeys.forEach(hallName => {
                    const hallData = data["exam"].halls[hallName];
                    const rows = hallData.rows;
                    const columns = hallData.columns;

                    // Initialize grid
                    const grid = Array(rows).fill(null).map(() => Array(columns).fill(null));

                    // Populate grid from row0, row1, etc.
                    for (let r = 0; r < rows; r++) {
                        const rowKey = `row${r}`;
                        const rowStudents = hallData[rowKey]; // Array of students for this row

                        if (Array.isArray(rowStudents)) {
                            rowStudents.forEach((student, index) => {
                                if (student) {
                                    // Calculate column from bench (1-based) or fallback to index
                                    const colIndex = (student.bench !== undefined && student.bench !== null)
                                        ? parseInt(student.bench, 10) - 1
                                        : index;

                                    if (colIndex >= 0 && colIndex < columns) {
                                        grid[r][colIndex] = {
                                            ...student, // Preserve all original backend fields
                                            id: student.roll || `s_${hallName}_${r}_${colIndex}`,
                                            name: student.name,
                                            rollNo: student.roll,
                                            subject: student.subject,
                                            hallId: hallName,
                                            row: r,
                                            col: colIndex
                                        };
                                    }
                                }
                            });
                        }
                    }

                    apiHalls.push({
                        id: hallName, // Using name as ID since it's unique in the object keys
                        name: hallName,
                        rows: rows,
                        columns: columns,
                        type: hallData.type,
                        grid: grid
                    });
                });

                // Sort halls by name/number if needed
                apiHalls.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

                setExamData(apiExam);
                setHalls(apiHalls);
                // setStudents(data.students || []); 
                setUnallocatedStudents([]); // Backend doesn't seem to return unallocated list yet, defaulting to empty

                if (apiHalls.length > 0) {
                    setSelectedHallId(apiHalls[0].id);
                }
            } else {
                console.error("API returned unsuccessful response or no data");
            }

            setLoading(false);

        } catch (err) {
            console.error("Failed to fetch exam data", err);
            setLoading(false);
        }
    };

    const currentHall = halls.find(h => h.id === selectedHallId);

    /* ================= DRAG AND DROP HANDLERS ================= */

    const handleDragStart = (e, student, source) => {
        setDraggedStudent({ ...student, source }); // source: 'grid' or 'list'
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropOnSeat = (e, row, col) => {
        e.preventDefault();
        if (!draggedStudent || !currentHall) return;

        const newHalls = [...halls];
        const hallIndex = newHalls.findIndex(h => h.id === selectedHallId);
        const hall = newHalls[hallIndex];
        const targetSeat = hall.grid[row][col];

        // Case 1: Dragging from Unallocated List to Empty Seat
        if (draggedStudent.source === 'list' && !targetSeat) {
            // Remove from unallocated
            setUnallocatedStudents(prev => prev.filter(s => s.id !== draggedStudent.id));

            // Add to grid
            hall.grid[row][col] = { ...draggedStudent, hallId: hall.id, row, col, bench: col + 1 };
            delete hall.grid[row][col].source;
        }
        // Case 2: Dragging from Unallocated List to Occupied Seat (Swap)
        else if (draggedStudent.source === 'list' && targetSeat) {
            // Swap: Target goes to unallocated, Dragged goes to seat
            setUnallocatedStudents(prev => [
                ...prev.filter(s => s.id !== draggedStudent.id),
                { ...targetSeat, hallId: null, row: null, col: null, bench: null }
            ]);

            hall.grid[row][col] = { ...draggedStudent, hallId: hall.id, row, col, bench: col + 1 };
            delete hall.grid[row][col].source;
        }
        // Case 3: Dragging from Grid to Empty Seat (Move)
        else if (draggedStudent.source === 'grid' && !targetSeat) {
            // Remove from old pos
            const oldHall = newHalls.find(h => h.id === draggedStudent.hallId);
            if (oldHall) oldHall.grid[draggedStudent.row][draggedStudent.col] = null;

            // Add to new pos
            hall.grid[row][col] = { ...draggedStudent, hallId: hall.id, row, col, bench: col + 1 };
            delete hall.grid[row][col].source;
        }
        // Case 4: Dragging from Grid to Occupied Seat (Swap)
        else if (draggedStudent.source === 'grid' && targetSeat) {
            // Determine source hall (could be different or same)
            const oldHall = newHalls.find(h => h.id === draggedStudent.hallId);

            // Put target student in source position
            if (oldHall) {
                oldHall.grid[draggedStudent.row][draggedStudent.col] = {
                    ...targetSeat,
                    hallId: oldHall.id,
                    row: draggedStudent.row,
                    col: draggedStudent.col,
                    bench: draggedStudent.col + 1
                };
            }

            // Put dragged student in target position
            hall.grid[row][col] = { ...draggedStudent, hallId: hall.id, row, col, bench: col + 1 };
            delete hall.grid[row][col].source;
        }

        setHalls(newHalls);
        setDraggedStudent(null);
    };

    const handleDropOnList = (e) => {
        e.preventDefault();
        if (!draggedStudent || draggedStudent.source === 'list') return;

        // Remove from grid
        const newHalls = [...halls];
        const sourceHall = newHalls.find(h => h.id === draggedStudent.hallId);
        if (sourceHall) {
            sourceHall.grid[draggedStudent.row][draggedStudent.col] = null;
            setHalls(newHalls);

            // Add to unallocated
            setUnallocatedStudents(prev => [...prev, { ...draggedStudent, hallId: null, row: null, col: null, bench: null }]);
        }
        setDraggedStudent(null);
    };


    /* ================= STUDENT ACTIONS ================= */

    const handleDeleteStudent = (student, fromGrid) => {
        Swal.fire({
            title: 'Remove Student?',
            text: "This will remove the student from the allocation entirely.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (fromGrid) {
                    const newHalls = [...halls];
                    const hall = newHalls.find(h => h.id === student.hallId);
                    if (hall) hall.grid[student.row][student.col] = null;
                    setHalls(newHalls);
                } else {
                    setUnallocatedStudents(prev => prev.filter(s => s.id !== student.id));
                }
                Swal.fire('Deleted!', 'Student has been removed.', 'success');
            }
        });
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setEditFormData({ name: student.name, rollNo: student.rollNo });
        setIsEditModalOpen(true);
    };

    const saveEditStudent = () => {
        if (!editingStudent) return;

        const updatedStudent = { ...editingStudent, ...editFormData };

        if (updatedStudent.hallId) {
            // Update in Grid
            const newHalls = [...halls];
            const hall = newHalls.find(h => h.id === updatedStudent.hallId);
            if (hall) {
                hall.grid[updatedStudent.row][updatedStudent.col] = updatedStudent;
                setHalls(newHalls);
            }
        } else {
            // Update in Unallocated List
            setUnallocatedStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        }
        setIsEditModalOpen(false);
        setEditingStudent(null);
    };

    const handleAddStudent = () => {
        const newStudent = {
            id: `new_${Date.now()}`,
            name: addFormData.name,
            rollNo: addFormData.rollNo,
            hallId: null,
            row: null,
            col: null
        };
        setUnallocatedStudents(prev => [...prev, newStudent]);
        setIsAddModalOpen(false);
        setAddFormData({ name: "", rollNo: "" });
        Swal.fire('Added', 'New student added to unallocated list.', 'success');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Reconstruct the halls object: { "301": { rows:..., columns:..., row0: [...], ... } }
            const hallsPayload = {};

            halls.forEach(hall => {
                const hallObj = {
                    rows: hall.rows,
                    columns: hall.columns,
                    type: hall.type
                };

                // Reconstruct rows
                hall.grid.forEach((row, rIndex) => {
                    const rowKey = `row${rIndex}`;
                    // Map grid cells back to student objects or null/empty
                    hallObj[rowKey] = row.map(seat => {
                        if (!seat) return null;

                        // Create a clean student object to send back
                        // We spread seat, but we should remove frontend-specific internal flags if any
                        // We also need to ensure 'roll' is there (mapped from rollNo if edited)
                        const studentObj = {
                            ...seat,
                            roll: seat.rollNo, // Update roll in case it was edited
                            name: seat.name
                            // kept other original fields
                        };

                        // Cleanup frontend keys to keep payload clean (optional but good practice)
                        delete studentObj.id; // if id was synthesized
                        delete studentObj.hallId;
                        delete studentObj.row;
                        delete studentObj.col;
                        delete studentObj.rollNo; // backend uses 'roll'

                        return studentObj;
                    });
                });

                hallsPayload[hall.id] = hallObj;
            });

            const payload = {
                examId: examId,
                halls: hallsPayload,
                // If unallocatedStudents should be saved, the backend needs a way to store them.
                // Since the user prompt didn't show unallocated structure, we'll include it if the backend supports it,
                // or just log it for now.
                unallocated: unallocatedStudents.map(s => ({
                    ...s,
                    roll: s.rollNo,
                    rollNo: undefined,
                    hallId: null, row: null, col: null
                }))
            };

            console.log("Saving Data Payload:", payload);

            // POST to backend
            // Assuming endpoint is /updateSeating or similar, but user only gave fetch.
            // I will use a placeholder /updateDetails/${examId} based on common patterns.
            const res = await fetch(`https://cec-grd-backend.onrender.com/updateExamDetails/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Changes Saved",
                    text: "Seating arrangement updated successfully.",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw new Error("Server responded with error");
            }

        } catch (err) {
            console.error("Save failed:", err);
            Swal.fire({
                icon: "error",
                title: "Save Failed",
                text: "Could not save changes. Check console for details.",
            });
        } finally {
            setSaving(false);
        }
    };


    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D7FF9] mx-auto mb-4"></div>
                <p className="text-[#737373] font-Pmed">Loading seating data...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* HEADER */}
            <div className="bg-white border-b border-[#E6E6E6] px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                    >
                        <ArrowLeft className="text-[#737373]" size={20} />
                    </button>
                    <div>
                        <h1 className="text-[20px] font-Pmed text-[#262626]">{examData?.name}</h1>
                        <p className="text-[13px] text-[#737373]">Customize Seating Assignment</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#2D7FF9] hover:bg-[#2750AE] text-white px-6 py-2 rounded-lg font-Pmed transition-colors"
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Save size={18} />
                    )}
                    Save Changes
                </button>
            </div>

            {/* BODY */}
            <div className="flex-1 flex items-start">

                {/* LEFT SIDEBAR: UNALLOCATED STUDENTS */}
                <div className="w-80 bg-white border-r border-[#E6E6E6] flex flex-col sticky top-[81px] h-[calc(100vh-81px)]">
                    <div className="p-4 border-b border-[#E6E6E6] flex justify-between items-center bg-white z-10">
                        <h2 className="font-Pmed text-[#262626]">Unallocated ({unallocatedStudents.length})</h2>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-md text-[#2D7FF9]" title="Add Student"
                        >
                            <UserPlus size={18} />
                        </button>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-3"
                        onDragOver={handleDragOver}
                        onDrop={handleDropOnList}
                    >
                        {unallocatedStudents.length === 0 ? (
                            <p className="text-center text-sm text-[#737373] mt-10">No unallocated students.</p>
                        ) : (
                            unallocatedStudents.map(student => (
                                <div
                                    key={student.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, student, 'list')}
                                    className="bg-white border border-[#E6E6E6] p-3 rounded-lg shadow-sm hover:border-[#2D7FF9] cursor-grab active:cursor-grabbing group relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-Pmed text-[#262626] text-sm">{student.name}</p>
                                            <p className="font-Preg text-[#737373] text-xs">{student.rollNo}</p>
                                        </div>
                                        <GripVertical size={16} className="text-[#A3A3A3]" />
                                    </div>

                                    <div className="absolute top-2 right-8 hidden group-hover:flex bg-white shadow-md rounded border border-[#E6E6E6]">
                                        <button onClick={() => handleEditStudent(student)} className="p-1.5 hover:bg-[#F1F5F9] text-blue-600"><Edit2 size={12} /></button>
                                        <button onClick={() => handleDeleteStudent(student, false)} className="p-1.5 hover:bg-[#ffefef] text-red-600"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>


                {/* MAIN AREA: HALL GRID */}
                <div className="flex-1 flex flex-col bg-[#F3F4F6] min-w-0">
                    {/* HALL TABS */}
                    <div className="bg-white px-6 py-2 border-b border-[#E6E6E6] flex gap-2 overflow-x-auto sticky top-[81px] z-10">
                        {halls.map(hall => (
                            <button
                                key={hall.id}
                                onClick={() => setSelectedHallId(hall.id)}
                                className={`px-4 py-2 rounded-full text-sm font-Pmed whitespace-nowrap transition-colors ${selectedHallId === hall.id
                                    ? "bg-[#2D7FF9] text-white"
                                    : "bg-[#F1F5F9] text-[#737373] hover:bg-[#E2E8F0]"
                                    }`}
                            >
                                {hall.name} ({hall.rows}x{hall.columns})
                            </button>
                        ))}
                    </div>

                    {/* VISUALIZER */}
                    <div className="p-8 flex justify-center items-start min-h-[calc(100vh-140px)]">
                        {currentHall && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E6E6E6] inline-block">
                                <div className="mb-6 text-center">
                                    <h2 className="text-xl font-Pmed text-[#262626]">{currentHall.name}</h2>
                                    <div className="w-64 h-2 bg-[#2D2D2D] mx-auto mt-2 rounded"></div>
                                    <p className="text-xs text-[#737373] mt-1">Blackboard / Screen</p>
                                </div>

                                <div
                                    className="grid gap-4"
                                    style={{
                                        gridTemplateColumns: `repeat(${currentHall.columns}, minmax(80px, 1fr))`
                                    }}
                                >
                                    {currentHall.grid.map((row, rIndex) => (
                                        row.map((seat, cIndex) => (
                                            <div
                                                key={`${rIndex}-${cIndex}`}
                                                className={`
                                            h-24 rounded-lg border-2 flex flex-col items-center justify-center p-2 relative group transition-colors
                                            ${seat
                                                        ? "border-[#2D7FF9] bg-[#F0F7FF]"
                                                        : "border-dashed border-[#CFD8DC] bg-white hover:border-[#90A4AE]"}
                                        `}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDropOnSeat(e, rIndex, cIndex)}
                                            >
                                                {seat ? (
                                                    <div
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, seat, 'grid')}
                                                        className="w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                                                    >
                                                        <p className="font-Pmed text-[#262626] text-xs text-center leading-tight mb-1">{seat.name}</p>
                                                        <span className="bg-[#E0E7FF] text-[#3730A3] text-[10px] font-bold px-1.5 py-0.5 rounded">{seat.rollNo}</span>

                                                        <div className="absolute -top-2 -right-2 hidden group-hover:flex bg-white shadow-md rounded-full border border-[#E6E6E6] overflow-hidden">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleEditStudent(seat); }}
                                                                className="p-1 hover:bg-[#F1F5F9] text-blue-600 border-r border-[#E6E6E6]"
                                                            >
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteStudent(seat, true); }}
                                                                className="p-1 hover:bg-[#ffefef] text-red-600"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#9CA3AF] text-xs">Empty</span>
                                                )}

                                                <div className="absolute bottom-1 left-2 text-[8px] text-[#A3A3A3]">
                                                    {String.fromCharCode(65 + rIndex)}{cIndex + 1}
                                                </div>
                                            </div>
                                        ))
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-Pmed mb-4">Edit Student</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-Pmed text-[#404040] mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full border border-[#E6E6E6] rounded p-2 focus:border-[#2D7FF9] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-Pmed text-[#404040] mb-1">Roll No</label>
                                <input
                                    type="text"
                                    value={editFormData.rollNo}
                                    onChange={(e) => setEditFormData({ ...editFormData, rollNo: e.target.value })}
                                    className="w-full border border-[#E6E6E6] rounded p-2 focus:border-[#2D7FF9] outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-[#737373] hover:bg-[#F1F5F9] rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditStudent}
                                className="px-4 py-2 bg-[#2D7FF9] text-white rounded hover:bg-[#2750AE]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-Pmed mb-4">Add New Student</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-Pmed text-[#404040] mb-1">Name</label>
                                <input
                                    type="text"
                                    value={addFormData.name}
                                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                    className="w-full border border-[#E6E6E6] rounded p-2 focus:border-[#2D7FF9] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-Pmed text-[#404040] mb-1">Roll No</label>
                                <input
                                    type="text"
                                    value={addFormData.rollNo}
                                    onChange={(e) => setAddFormData({ ...addFormData, rollNo: e.target.value })}
                                    className="w-full border border-[#E6E6E6] rounded p-2 focus:border-[#2D7FF9] outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-[#737373] hover:bg-[#F1F5F9] rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStudent}
                                className="px-4 py-2 bg-[#2D7FF9] text-white rounded hover:bg-[#2750AE]"
                            >
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomizeSeating;
