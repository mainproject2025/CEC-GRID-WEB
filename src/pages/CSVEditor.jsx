import React, { useState, useRef } from "react";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Download,
    Upload,
    Grid3X3,
    Users,
    Landmark,
    Eraser,
    Columns,
    Rows,
    CornerRightDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CSVEditor = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Default state: 5 rows, 4 columns
    const [headers, setHeaders] = useState(["Column 1", "Column 2", "Column 3", "Column 4"]);
    const [rows, setRows] = useState([
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
    ]);

    const [fileName, setFileName] = useState("data_export");

    // --- Handlers ---

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newRows = [...rows];
        newRows[rowIndex][colIndex] = value;
        setRows(newRows);
    };

    const handleHeaderChange = (colIndex, value) => {
        const newHeaders = [...headers];
        newHeaders[colIndex] = value;
        setHeaders(newHeaders);
    };

    const addRow = () => {
        setRows([...rows, new Array(headers.length).fill("")]);
    };

    const deleteRow = (index) => {
        if (rows.length <= 1) return;
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const addColumn = () => {
        setHeaders([...headers, `Column ${headers.length + 1}`]);
        setRows(rows.map(row => [...row, ""]));
    };

    const deleteColumn = (index) => {
        if (headers.length <= 1) return;
        setHeaders(headers.filter((_, i) => i !== index));
        setRows(rows.map(row => row.filter((_, i) => i !== index)));
    };

    const fillDown = (rowIndex, colIndex) => {
        const valueToFill = rows[rowIndex][colIndex];
        const newRows = rows.map((row, i) => {
            if (i > rowIndex) {
                const newRow = [...row];
                newRow[colIndex] = valueToFill;
                return newRow;
            }
            return row;
        });
        setRows(newRows);

        Swal.fire({
            icon: 'success',
            title: 'Filled Down',
            text: `Value duplicated to ${rows.length - 1 - rowIndex} rows below.`,
            timer: 1000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    };

    const clearGrid = () => {
        Swal.fire({
            title: "Clear all data?",
            text: "This will reset the entire grid.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Yes, clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setRows([["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]]);
                setHeaders(["Column 1", "Column 2", "Column 3", "Column 4"]);
            }
        });
    };

    // --- Presets ---

    const applyStudentPreset = () => {
        setHeaders(["Department", "Batch", "RollNumber", "StudentName", "Branch", "Subject", "year"]);
        setRows(new Array(10).fill(0).map(() => new Array(7).fill("")));
        setFileName("student_details");
    };

    const applyHallPreset = () => {
        setHeaders(["HallName", "Columns", "Rows", "Total Capacity", "type"]);
        setRows(new Array(10).fill(0).map(() => new Array(5).fill("")));
        setFileName("hall_details");
    };

    // --- Import/Export ---

    const exportToCSV = () => {
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Exported!',
            text: `File "${fileName}.csv" has been downloaded.`,
            timer: 2000,
            showConfirmButton: false
        });
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split("\n").filter(line => line.trim() !== "");
            if (lines.length === 0) return;

            const newHeaders = lines[0].split(",");
            const newRows = lines.slice(1).map(line => line.split(","));

            setHeaders(newHeaders);
            setRows(newRows);
            setFileName(file.name.replace(".csv", ""));
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* Header */}
            <div className="bg-white border-b border-[#E6E6E6] px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#404040]" />
                    </button>
                    <div>
                        <h1 className="text-xl font-Pbold text-[#262626] flex items-center gap-2">
                            <Grid3X3 size={24} className="text-[#2D7FF9]" />
                            CSV Editor
                        </h1>
                        <p className="text-sm text-[#737373]">Create and manage custom data for seating arrangements</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 bg-[#2D7FF9] text-white px-4 py-2 rounded-lg font-Pmed hover:bg-[#2750AE] transition-all"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="px-8 mt-8 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-12 gap-6">

                    {/* Sidebar Tools */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">

                        {/* Presets */}
                        <div className="bg-white border border-[#E6E6E6] rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-Pbold text-[#262626] mb-4 uppercase tracking-wider">Tailored Templates</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={applyStudentPreset}
                                    className="flex items-center gap-3 w-full p-3 border border-[#E6E6E6] rounded-lg hover:border-[#2D7FF9] hover:bg-blue-50 transition-all text-left"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users size={18} className="text-[#2D7FF9]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-Pmed text-[#262626]">Student Details</p>
                                        <p className="text-[11px] text-[#737373]">Roll, Name, Dept, Batch</p>
                                    </div>
                                </button>
                                <button
                                    onClick={applyHallPreset}
                                    className="flex items-center gap-3 w-full p-3 border border-[#E6E6E6] rounded-lg hover:border-[#2D7FF9] hover:bg-blue-50 transition-all text-left"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Landmark size={18} className="text-[#2D7FF9]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-Pmed text-[#262626]">Hall Details</p>
                                        <p className="text-[11px] text-[#737373]">Name, Rows, Cols, Cap</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Grid Tools */}
                        <div className="bg-white border border-[#E6E6E6] rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-Pbold text-[#262626] mb-4 uppercase tracking-wider">Grid Controls</h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={addRow} className="flex items-center justify-center gap-2 py-2 border border-[#E6E6E6] rounded-lg text-sm font-Pmed hover:bg-[#F8FAFC]">
                                        <Rows size={16} /> Add Row
                                    </button>
                                    <button onClick={addColumn} className="flex items-center justify-center gap-2 py-2 border border-[#E6E6E6] rounded-lg text-sm font-Pmed hover:bg-[#F8FAFC]">
                                        <Columns size={16} /> Add Col
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImport}
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex items-center justify-center gap-2 w-full py-2 border border-[#E6E6E6] rounded-lg text-sm font-Pmed hover:bg-[#F8FAFC]"
                                >
                                    <Upload size={16} /> Import from CSV
                                </button>

                                <button
                                    onClick={clearGrid}
                                    className="flex items-center justify-center gap-2 w-full py-2 border border-[#EF4444] text-[#EF4444] rounded-lg text-sm font-Pmed hover:bg-red-50 transition-colors"
                                >
                                    <Eraser size={16} /> Clear All
                                </button>
                            </div>
                        </div>

                        {/* Export Settings */}
                        <div className="bg-white border border-[#E6E6E6] rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-Pbold text-[#262626] mb-4 uppercase tracking-wider">Export Filename</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#F8FAFC] border border-[#E6E6E6] rounded-lg text-sm focus:outline-none focus:border-[#2D7FF9]"
                                    placeholder="Enter filename..."
                                />
                                <span className="absolute right-3 top-2 text-[#737373] text-sm">.csv</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid Editor */}
                    <div className="col-span-12 lg:col-span-9">
                        <div className="bg-white border border-[#E6E6E6] rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                                <table className="w-full border-collapse">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-[#F8FAFC]">
                                            <th className="w-10 border border-[#E6E6E6]"></th>
                                            {headers.map((header, colIndex) => (
                                                <th key={colIndex} className="min-w-[150px] border border-[#E6E6E6] px-2 py-3">
                                                    <div className="flex items-center group">
                                                        <input
                                                            type="text"
                                                            value={header}
                                                            onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                                                            className="bg-transparent w-full text-xs font-Pbold text-[#737373] uppercase text-center focus:outline-none focus:text-[#2D7FF9] placeholder-gray-300"
                                                            placeholder={`Header ${colIndex + 1}`}
                                                        />
                                                        <button
                                                            onClick={() => deleteColumn(colIndex)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                                                        >
                                                            <Plus size={14} className="rotate-45" />
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="w-10 border border-[#E6E6E6] text-center bg-[#F8FAFC]">
                                                    <div className="flex flex-col items-center group relative">
                                                        <span className="text-[10px] text-[#A3A3A3] group-hover:hidden">{rowIndex + 1}</span>
                                                        <button
                                                            onClick={() => deleteRow(rowIndex)}
                                                            className="hidden group-hover:flex text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                                {row.map((cell, colIndex) => (
                                                    <td key={colIndex} className="border border-[#E6E6E6] p-0 relative group/cell">
                                                        <input
                                                            type="text"
                                                            value={cell}
                                                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                            className="w-full px-4 py-3 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2D7FF9] transition-all bg-transparent pr-8"
                                                        />
                                                        {rowIndex < rows.length - 1 && (
                                                            <button
                                                                onClick={() => fillDown(rowIndex, colIndex)}
                                                                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 p-1 text-[#2D7FF9] hover:bg-blue-50 rounded transition-all"
                                                                title="Fill Down"
                                                            >
                                                                <CornerRightDown size={14} />
                                                            </button>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Bottom Add Row Bar */}
                            <button
                                onClick={addRow}
                                className="w-full py-3 flex items-center justify-center gap-2 text-[#737373] hover:text-[#2D7FF9] hover:bg-blue-50 transition-all border-t border-[#E6E6E6]"
                            >
                                <Plus size={18} />
                                <span className="text-sm font-Pmed">Add New Row</span>
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-[#737373] text-[12px] px-2 font-Pmed">
                            <p>Total: {rows.length} rows × {headers.length} columns</p>
                            <p>Tip: You can edit headers by clicking on them</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CSVEditor;
