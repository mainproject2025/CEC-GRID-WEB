import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const IntroAnimation = ({ onComplete }) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 100),       // grid starts
            setTimeout(() => setStage(2), 1600),      // blocks pop (faster)
            setTimeout(() => setStage(3), 2800),      // text appears (faster)
            setTimeout(() => setStage(4), 4000),      // complete
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    // Auto-redirect when animation completes
    useEffect(() => {
        if (stage === 4) {
            const timeout = setTimeout(onComplete, 800); // Short pause before redirect
            return () => clearTimeout(timeout);
        }
    }, [stage, onComplete]);

    return (
        <div className="fixed inset-0 z-9999 min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center overflow-hidden font-sans selection:bg-black selection:text-white">
            {/* Premium background subtle noise */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmZmZiIvPjxjaXJjbGUgY3g9IjUuNSIgY3k9IjUuNSIgcj0iMC41IiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjA1Ii8+PGNpcmNsZSBjeD0iMTQuNSIgY3k9IjE5LjUiIHI9IjAuNCIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')]"></div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

        .premium-text {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          letter-spacing: -0.04em;
          font-weight: 900;
        }

        .draw-stroke {
          stroke-dasharray: 2400;
          stroke-dashoffset: 2400;
          animation: drawLine 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .pop-in {
          animation: popPremium 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          transform-origin: center;
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .text-reveal {
          animation: textReveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        @keyframes popPremium {
          0%   { transform: scale(0) translateY(20px); opacity: 0; }
          60%  { transform: scale(1.05) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes textReveal {
          0%   { transform: translateY(30px) scale(0.96); opacity: 0; filter: blur(8px); }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
        }
      `}</style>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container */}
                <div className="w-72 h-72 md:w-96 md:h-96 relative mb-12 md:mb-16">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Outer Frame - thicker & more premium */}
                        <rect
                            x="8" y="8" width="384" height="384"
                            fill="none"
                            stroke="#000"
                            strokeWidth="20"
                            className={stage >= 1 ? "draw-stroke" : "opacity-0"}
                            style={{ animationDelay: '0.1s' }}
                        />

                        {/* Vertical Center */}
                        <line
                            x1="200" y1="0" x2="200" y2="400"
                            stroke="#000"
                            strokeWidth="20"
                            className={stage >= 1 ? "draw-stroke" : "opacity-0"}
                            style={{ animationDelay: '0.4s' }}
                        />

                        {/* Horizontal Center */}
                        <line
                            x1="0" y1="200" x2="400" y2="200"
                            stroke="#000"
                            strokeWidth="20"
                            className={stage >= 1 ? "draw-stroke" : "opacity-0"}
                            style={{ animationDelay: '0.8s' }}
                        />

                        {/* === BLOCKS === */}
                        {/* Top Left */}
                        <g className={stage >= 2 ? "pop-in" : "opacity-0"} style={{ animationDelay: '0ms' }}>
                            <rect x="138" y="74" width="52" height="52" rx="6" fill="#000" />
                        </g>

                        {/* Top Right - two blocks */}
                        <g className={stage >= 2 ? "pop-in" : "opacity-0"} style={{ animationDelay: '100ms' }}>
                            <rect x="338" y="50" width="52" height="52" rx="6" fill="#000" />
                            <rect x="338" y="122" width="52" height="52" rx="6" fill="#000" />
                        </g>

                        {/* Bottom Left */}
                        <g className={stage >= 2 ? "pop-in" : "opacity-0"} style={{ animationDelay: '200ms' }}>
                            <rect x="138" y="274" width="52" height="52" rx="6" fill="#000" />
                        </g>

                        {/* Bottom Right */}
                        <g className={stage >= 2 ? "pop-in" : "opacity-0"} style={{ animationDelay: '300ms' }}>
                            <rect x="210" y="338" width="52" height="52" rx="6" fill="#000" />
                            <rect x="286" y="238" width="52" height="52" rx="6" fill="#000" />
                        </g>
                    </svg>
                </div>

                {/* Text */}
                <div className={`flex flex-col items-center ${stage >= 3 ? "text-reveal" : "opacity-0"}`}>
                    <div className="flex items-center gap-3 md:gap-5">
                        <h1 className="text-7xl md:text-9xl premium-text text-black tracking-[-0.06em] leading-none">
                            CEC
                        </h1>

                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Custom G */}
                             

                            <h1 className="text-7xl md:text-9xl premium-text text-black tracking-[-0.06em] leading-none">
                                GRID
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
