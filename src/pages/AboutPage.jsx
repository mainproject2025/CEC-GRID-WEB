import React from "react";
import { Info, Code, Star, Users, Github, Linkedin, Mail, User } from "lucide-react";

const teamMembers = [
    {
        name: "Dona Ann Alex",
        role: "Backend Developer ",
        github: "https://github.com/Dona-20",
        linkedin: "https://www.linkedin.com/in/donaalex1",
        email: "email@example.com",
        type: "developer"
    },
    {
        name: "Jithu Girish",
        role: "Backend Developer & Database Management",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "developer"
    },
    {
        name: "Syam S",
        role: "Frontend Developer",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "developer"
    },
    {
        name: "Thejas P K",
        role: "UI UX & Frontend Developer",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "developer"
    },
    {
        name: "Reshma Ann Mathews",
        role: "Project Guide",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "mentor",
        category: "guide"
    },
    {
        name: "Dr. Sabeena K",
        role: "Project Coordinator",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "mentor",
        category: "coordinator"
    },
    {
        name: "Sulaja Sanal",
        role: "Project Coordinator",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "mentor",
        category: "coordinator"
    },
    {
        name: "Dr. Geetha S",
        role: "Project Coordinator",
        linkedin: "https://linkedin.com",
        email: "email@example.com",
        type: "mentor",
        category: "coordinator"
    },
];

// Helper to render a group of team members
const TeamGroup = ({ title, members }) => (
    <div className="mb-8 last:mb-0">
        <h4 className="text-[16px] font-Pmed text-[#525252] mb-4 border-b border-[#E6E6E6] pb-2">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member, index) => (
                <div key={index} className="flex items-start gap-4 p-5 border border-[#E6E6E6] rounded-xl hover:border-[#2D7FF9] transition-colors">
                    <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E6E6E6] overflow-hidden shrink-0">
                        <User size={32} className={`text-${member.type === 'developer' ? '[#A3A3A3]' : '[#2D7FF9]'}`} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-Pmed text-[#262626] text-lg">{member.name}</h4>
                        <p className="text-[#737373] text-sm mb-3">{member.role}</p>
                        <div className="flex items-center gap-3">
                            {member.github && (
                                <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E6E6E6] flex items-center justify-center text-[#525252] hover:text-[#262626] hover:bg-[#F1F5F9] transition-colors">
                                    <Github size={16} />
                                </a>
                            )}
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E6E6E6] flex items-center justify-center text-[#525252] hover:text-[#0A66C2] hover:bg-[#F1F5F9] transition-colors">
                                    <Linkedin size={16} />
                                </a>
                            )}
                            {member.email && (
                                <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E6E6E6] flex items-center justify-center text-[#525252] hover:text-[#EA4335] hover:bg-[#F1F5F9] transition-colors">
                                    <Mail size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] px-8 py-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Info size={28} className="text-[#2D7FF9]" />
                        <h1 className="text-[24px] font-Pmed text-[#262626]">About CEC-GRID</h1>
                    </div>
                    <p className="text-[#737373] font-Preg ml-10">
                        Learn more about the vision, features, and technology behind the ultimate seating arrangement system.
                    </p>
                    <div className="w-full h-px bg-[#E6E6E6] mt-6" />
                </div>

                {/* Mission Section */}
                <div className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm p-8 mb-8">
                    <h2 className="text-[20px] font-Pmed text-[#262626] mb-4">Our Mission</h2>
                    <p className="text-[#525252] text-md leading-relaxed">
                        CEC-GRID was designed to streamline the complex and time-consuming process of exam hall seating allocations. With automated logic, dynamic visualizations, and easy hall management, we aim to provide an effortless experience for administrators and staff, eliminating the manual overhead associated with traditional methods.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Features block */}
                    <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#EFF6FF] text-[#2D7FF9] rounded-lg flex items-center justify-center">
                                <Star size={20} />
                            </div>
                            <h3 className="text-lg font-Pmed text-[#262626]">Key Highlights</h3>
                        </div>
                        <ul className="space-y-3 text-[#525252] text-sm leading-relaxed">
                            <li className="flex items-start gap-2">
                                <span className="text-[#2D7FF9] mt-1">•</span>
                                <div>
                                    <strong className="text-[#262626]">Algorithmic Allocation:</strong> Smart seating generation avoiding same-branch overlaps.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#2D7FF9] mt-1">•</span>
                                <div>
                                    <strong className="text-[#262626]">Interactive Visualiser:</strong> Comprehensive 2D map view of all allocated seats and halls.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#2D7FF9] mt-1">•</span>
                                <div>
                                    <strong className="text-[#262626]">Reporting & Export:</strong> Easily export allocation plans to PDF for immediate print access.
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Tech stack block */}
                    <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#F0FDF4] text-[#16A34A] rounded-lg flex items-center justify-center">
                                <Code size={20} />
                            </div>
                            <h3 className="text-lg font-Pmed text-[#262626]">Technology</h3>
                        </div>
                        <p className="text-[#525252] text-sm leading-relaxed mb-6">
                            Built robustly from the ground up for performance and reliability across platforms, utilizing modern web frameworks.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-xs rounded-lg font-medium">React 18</span>
                            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-xs rounded-lg font-medium">Tailwind CSS</span>
                            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-xs rounded-lg font-medium">Lucide Icons</span>
                            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-xs rounded-lg font-medium">Vite</span>
                            <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-xs rounded-lg font-medium">Firebase Firebase</span>
                        </div>
                    </div>
                </div>

                {/* Team / Community */}
                <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 shadow-sm mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#FAF5FF] text-[#9333EA] rounded-lg flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <h3 className="text-lg font-Pmed text-[#262626]">Community & Support</h3>
                    </div>
                    <p className="text-[#525252] text-sm leading-relaxed mb-6">
                        CEC-GRID is developed with user experience in mind. We appreciate the feedback and contributions from our team and users to constantly improve the system.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-Pmed text-[#262626] hover:text-[#2D7FF9] transition-colors">
                            <Github size={18} />
                            View on GitHub
                        </a>
                    </div>
                </div>

                {/* Team Section */}
                <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 shadow-sm mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-lg flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <h3 className="text-lg font-Pmed text-[#262626]">Meet the Team</h3>
                    </div>

                    {/* Grouped Team Rendering */}
                    <TeamGroup title="Developers" members={teamMembers.filter(m => m.type === 'developer')} />
                    <TeamGroup title="Project Guide" members={teamMembers.filter(m => m.category === 'guide')} />
                    <TeamGroup title="Project Coordinators" members={teamMembers.filter(m => m.category === 'coordinator')} />
                </div>

                {/* Footer Section */}
                <div className="mt-12 text-center text-[#A3A3A3] text-sm pb-8">
                    <p>&copy; {new Date().getFullYear()} CEC-GRID System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
