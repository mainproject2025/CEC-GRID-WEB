import React from "react";
import {
    ClipboardList,
    Landmark,
    Bell,
    FileText,
    Upload,
    Download,
    Plus,
    HelpCircle,
    Search
} from "lucide-react";

const HelpPage = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <HelpCircle size={28} className="text-[#2D7FF9]" />
                        <h1 className="text-[24px] font-Pmed text-[#262626]">Help & Documentation</h1>
                    </div>
                    <p className="text-[#737373] font-Preg ml-10">
                        Learn how to use CEC-GRID to manage seating arrangements efficiently.
                    </p>
                    <div className="w-full h-px bg-[#E6E6E6] mt-6" />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {/* Seating Arrangements */}
                    <div className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-[#EFF6FF] text-[#2D7FF9] rounded-lg flex items-center justify-center mb-4">
                                <ClipboardList size={24} />
                            </div>
                            <h3 className="text-lg font-Pmed text-[#262626] mb-2">Seating Arrangements</h3>
                            <p className="text-[#737373] text-sm mb-4 leading-relaxed">
                                View and manage all your exam seating plans. You can see recent activity, publish status, and download PDF reports.
                            </p>
                            <ul className="space-y-2 text-sm text-[#525252]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#2D7FF9] mt-1">•</span>
                                    <span><strong>Customize:</strong> Edit student placements manually.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#2D7FF9] mt-1">•</span>
                                    <span><strong>Download:</strong> Generate print-ready PDF files.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Create New Arrangement */}
                    <div className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-[#F0FDF4] text-[#16A34A] rounded-lg flex items-center justify-center mb-4">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-lg font-Pmed text-[#262626] mb-2">Create New Arrangement</h3>
                            <p className="text-[#737373] text-sm mb-4 leading-relaxed">
                                Generate a new seating plan by uploading student and hall data.
                            </p>
                            <ul className="space-y-2 text-sm text-[#525252]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#16A34A] mt-1">•</span>
                                    <span><strong>Upload Data:</strong> Upload Excel/CSV files for students and optional hall details.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#16A34A] mt-1">•</span>
                                    <span><strong>Select Mode:</strong> Choose between Normal or Elective exams.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Hall Management */}
                    <div className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-[#FFF7ED] text-[#EA580C] rounded-lg flex items-center justify-center mb-4">
                                <Landmark size={24} />
                            </div>
                            <h3 className="text-lg font-Pmed text-[#262626] mb-2">Hall Management</h3>
                            <p className="text-[#737373] text-sm mb-4 leading-relaxed">
                                Configure your exam halls, rows, columns, and availability status.
                            </p>
                            <ul className="space-y-2 text-sm text-[#525252]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#EA580C] mt-1">•</span>
                                    <span><strong>Add/Edit:</strong> Update hall capacity and dimensions.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#EA580C] mt-1">•</span>
                                    <span><strong>Maintenance:</strong> Mark halls as unavailable if needed.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Data Upload Guide Section */}
                <div className="mt-12 mb-12">
                    <h2 className="text-[20px] font-Pmed text-[#262626] mb-6">How to Prepare Your Data</h2>

                    <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 space-y-10">

                        {/* Student Data Section */}
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-lg font-Pmed text-[#262626] mb-4 flex items-center gap-2">
                                    <Upload size={20} className="text-[#2D7FF9]" />
                                    Student Data Format
                                </h3>
                                <p className="text-[#737373] text-sm mb-6 leading-relaxed">
                                    Your student data file (CSV) must contain the following headers exactly as shown.
                                </p>

                                <div className="overflow-x-auto border border-[#E6E6E6] rounded-lg mb-6">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[#F8FAFC] text-[#262626] font-Pmed border-b border-[#E6E6E6]">
                                            <tr>
                                                <th className="px-4 py-3">Header Name</th>
                                                <th className="px-4 py-3">Example</th>
                                                <th className="px-4 py-3">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6E6E6]">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Department</td>
                                                <td className="px-4 py-3 text-[#737373]">EC</td>
                                                <td className="px-4 py-3 text-[#737373]">Department Code</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Batch</td>
                                                <td className="px-4 py-3 text-[#737373]">A</td>
                                                <td className="px-4 py-3 text-[#737373]">Class Batch</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">RollNumber</td>
                                                <td className="px-4 py-3 text-[#737373]">EC22A01</td>
                                                <td className="px-4 py-3 text-[#737373]">Unique Roll Number</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">StudentName</td>
                                                <td className="px-4 py-3 text-[#737373]">ABEL FRANCIS</td>
                                                <td className="px-4 py-3 text-[#737373]">Full Name</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Branch</td>
                                                <td className="px-4 py-3 text-[#737373]">EC</td>
                                                <td className="px-4 py-3 text-[#737373]">Branch Code</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Subject</td>
                                                <td className="px-4 py-3 text-[#737373]">ECT426</td>
                                                <td className="px-4 py-3 text-[#737373]">Subject Code</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">year</td>
                                                <td className="px-4 py-3 text-[#737373]">4</td>
                                                <td className="px-4 py-3 text-[#737373]">Academic Year</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    onClick={() => {
                                        const csvContent = "Department,Batch,RollNumber,StudentName,Branch,Subject,year\nCS,D,CS22D36,John Doe,CS,CST426,4";
                                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                        const link = document.createElement("a");
                                        const url = URL.createObjectURL(blob);
                                        link.setAttribute("href", url);
                                        link.setAttribute("download", "student_template.csv");
                                        link.style.visibility = 'hidden';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="flex items-center gap-2 bg-[#E6F4EA] text-[#137333] px-4 py-2.5 rounded-lg hover:bg-[#D1E9D7] transition-colors font-Pmed text-sm"
                                >
                                    <Download size={18} />
                                    Download Student CSV Template
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-px bg-[#E6E6E6]" />

                        {/* Hall Data Section */}
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <h3 className="text-lg font-Pmed text-[#262626] mb-4 flex items-center gap-2">
                                    <Landmark size={20} className="text-[#EA580C]" />
                                    Hall Data Format
                                </h3>
                                <p className="text-[#737373] text-sm mb-6 leading-relaxed">
                                    Your hall data file (CSV) must contain the following headers exactly as shown.
                                </p>

                                <div className="overflow-x-auto border border-[#E6E6E6] rounded-lg mb-6">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[#F8FAFC] text-[#262626] font-Pmed border-b border-[#E6E6E6]">
                                            <tr>
                                                <th className="px-4 py-3">Header Name</th>
                                                <th className="px-4 py-3">Example</th>
                                                <th className="px-4 py-3">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6E6E6]">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">HallName</td>
                                                <td className="px-4 py-3 text-[#737373]">Room 101</td>
                                                <td className="px-4 py-3 text-[#737373]">Name/Number of the hall</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Columns</td>
                                                <td className="px-4 py-3 text-[#737373]">9</td>
                                                <td className="px-4 py-3 text-[#737373]">Number of columns</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Rows</td>
                                                <td className="px-4 py-3 text-[#737373]">6</td>
                                                <td className="px-4 py-3 text-[#737373]">Number of rows</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">Total Capacity</td>
                                                <td className="px-4 py-3 text-[#737373]">54</td>
                                                <td className="px-4 py-3 text-[#737373]">Total seats available</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-[#262626]">type</td>
                                                <td className="px-4 py-3 text-[#737373]">Bench</td>
                                                <td className="px-4 py-3 text-[#737373]">Type of seating (Bench/Chair)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    onClick={() => {
                                        const csvContent = "HallName,Columns,Rows,Total Capacity,type\nRoom 101,9,6,54,Bench";
                                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                        const link = document.createElement("a");
                                        const url = URL.createObjectURL(blob);
                                        link.setAttribute("href", url);
                                        link.setAttribute("download", "hall_template.csv");
                                        link.style.visibility = 'hidden';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="flex items-center gap-2 bg-[#FFF7ED] text-[#EA580C] px-4 py-2.5 rounded-lg hover:bg-[#FFEDD5] transition-colors font-Pmed text-sm"
                                >
                                    <Download size={18} />
                                    Download Hall CSV Template
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

                {/* FAQ / Tips Section */}
                <div className="mt-12">
                    <h2 className="text-[20px] font-Pmed text-[#262626] mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-white border border-[#E6E6E6] rounded-lg p-5">
                            <h4 className="font-Pmed text-[#262626] mb-2 flex items-center gap-2">
                                <FileText size={18} className="text-[#2D7FF9]" />
                                What file formats are supported?
                            </h4>
                            <p className="text-[#737373] text-sm ml-7">
                                The system accepts <strong>.xlsx, .xls, and .csv</strong> files for student and hall data uploads. Ensure your files follow the required template structure.
                            </p>
                        </div>

                        <div className="bg-white border border-[#E6E6E6] rounded-lg p-5">
                            <h4 className="font-Pmed text-[#262626] mb-2 flex items-center gap-2">
                                <Bell size={18} className="text-[#2D7FF9]" />
                                How do notifications work?
                            </h4>
                            <p className="text-[#737373] text-sm ml-7">
                                You will receive notifications when a seating generation process completes or if there are any errors during processing. Check the Notifications tab in the sidebar.
                            </p>
                        </div>

                        <div className="bg-white border border-[#E6E6E6] rounded-lg p-5">
                            <h4 className="font-Pmed text-[#262626] mb-2 flex items-center gap-2">
                                <Search size={18} className="text-[#2D7FF9]" />
                                Can I search for a specific hall?
                            </h4>
                            <p className="text-[#737373] text-sm ml-7">
                                Yes, in the Hall Management section, use the search bar to find halls by name, building, or capacity. You can also sort the list by various criteria.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
