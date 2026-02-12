import React, { useState, useEffect } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useData } from "../context/DataContext";

const AddNewAdmin = () => {
    const navigate = useNavigate();
    const {
        admins,
        loadingAdmins,
        fetchAdmins,
        setAdmins // used for optimistic update if needed, or just let fetchAdmins handle it
    } = useData();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Admin",
    });

    // Additional local loading state for form submission interactions
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Passwords do not match!",
                confirmButtonColor: "#DC2626",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("cecgrid-token");
            const response = await fetch("http://localhost:5001/auth/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create admin");
            }

            Swal.fire({
                icon: "success",
                title: "Admin Added",
                text: "New admin has been successfully added.",
                confirmButtonColor: "#2D7FF9",
                background: "#F8FAFC",
            });

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "admin",
            });

            // Refresh list (force refresh to get new data)
            fetchAdmins(true);

        } catch (error) {
            console.error("Error adding admin:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to add new admin. Please try again.",
                confirmButtonColor: "#DC2626",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveAdmin = async (uid) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#E6E6E6',
            confirmButtonText: 'Yes, remove access!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("cecgrid-token");
                const response = await fetch(`http://localhost:5001/auth/adminDelete/${uid}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                    }
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to remove admin');
                }

                await Swal.fire(
                    'Removed!',
                    'Admin access has been revoked.',
                    'success'
                );

                fetchAdmins(true); // Force refresh

            } catch (error) {
                console.error("Error removing admin:", error);
                Swal.fire(
                    'Error!',
                    error.message || 'Failed to remove admin access.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate("/app")}
                        className="p-2 rounded-lg hover:bg-[#F1F5F9]"
                    >
                        <ArrowLeft size={22} className="text-[#737373]" />
                    </button>

                    <h1 className="text-[24px] font-Pmed text-gray-900">
                        ADD NEW ADMIN
                    </h1>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-[#E6E6E6] rounded-lg p-8 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label className="block text-[#262626] font-Pmed mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter full name"
                                className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[#262626] font-Pmed mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter email address"
                                className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9]"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-[#262626] font-Pmed mb-2">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9] bg-white"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Editor">Editor</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password */}
                            <div>
                                <label className="block text-[#262626] font-Pmed mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9]"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-[#262626] font-Pmed mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm password"
                                    className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg font-Preg text-[14px] focus:outline-none focus:border-[#2D7FF9]"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-6 border-t border-[#E6E6E6]">
                            <button
                                type="button"
                                onClick={() => navigate("/app")}
                                className="px-6 py-2 border border-[#E6E6E6] text-[#737373] rounded-lg font-Pmed hover:bg-[#F8FAFC]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting} // Use local submitting state for button
                                className="flex items-center gap-2 px-6 py-2 bg-[#2D7FF9] text-white rounded-lg font-Pmed hover:bg-[#2750AE] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    "Adding..."
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        Add Admin
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Current Admins List */}
                <div className="bg-white border border-[#E6E6E6] rounded-lg p-8">
                    <h2 className="text-[20px] font-Pmed text-gray-900 mb-6">Current Admins</h2>

                    {loadingAdmins ? (
                        <div className="py-8">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#2D7FF9] animate-[loading_1s_ease-in-out_infinite]"></div>
                            </div>
                            <p className="text-center text-[#737373] mt-4 text-sm font-Pmed">Loading admins...</p>
                            <style>{`
                                @keyframes loading {
                                    0% { transform: translateX(-100%); }
                                    100% { transform: translateX(100%); }
                                }
                            `}</style>
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No admins found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-[#E6E6E6]">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-Pmed text-[#262626]">Name</th>
                                        <th className="text-left py-3 px-4 font-Pmed text-[#262626]">Email</th>
                                        <th className="text-left py-3 px-4 font-Pmed text-[#262626]">Role</th>
                                        <th className="text-right py-3 px-4 font-Pmed text-[#262626]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin) => (
                                        <tr key={admin.uid} className="border-b border-[#E6E6E6] last:border-0 hover:bg-[#F8FAFC]">
                                            <td className="py-3 px-4 text-[#737373]">{admin.name}</td>
                                            <td className="py-3 px-4 text-[#737373]">{admin.email}</td>
                                            <td className="py-3 px-4 text-[#737373]">{admin.role}</td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => handleRemoveAdmin(admin.uid)}
                                                    className="text-red-500 hover:text-red-700 font-Pmed text-sm cursor-pointer"
                                                >
                                                    Remove Access
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddNewAdmin;
