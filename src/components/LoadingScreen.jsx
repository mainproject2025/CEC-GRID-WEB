import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500); // Wait a bit before finishing
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#0F172A] z-[9999] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse delay-700"></div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Configuration */}
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-t-[#2D7FF9] border-r-transparent border-b-[#2D7FF9] border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-r-[#2D7FF9] border-b-transparent border-l-[#2D7FF9] border-t-transparent rounded-full animate-spin-reverse opacity-70"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white tracking-widest">CG</span>
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    CEC<span className="text-[#2D7FF9]">GRID</span>
                </h1>
                <p className="text-[#94A3B8] text-sm tracking-widest uppercase mb-8">
                    Exam Seating Automation
                </p>

                {/* Branding/Loading Bar */}
                <div className="w-64 h-1 bg-[#1E293B] rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-[#2D7FF9] to-[#60A5FA] transition-all duration-300 ease-out relative"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                    </div>
                </div>

                <div className="mt-2 text-[#64748B] text-xs font-mono">
                    INITIALIZING SYSTEM... {Math.round(Math.min(progress, 100))}%
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
