import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Grid, ArrowRight, X } from 'lucide-react';
import college from '../assets/images/Logo.svg'
export default function CECGridLanding() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Theme color constant
  const THEME_COLOR = '#4F46E5';

  // --- Animation Loop for the Grid Background ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Reduced density for a cleaner look
      const numParticles = Math.floor((width * height) / 25000); 
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3, // Slower movement
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5, // Smaller particles
        });
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.03)'; // Very subtle grid
      ctx.lineWidth = 1;
      const gridSize = 80; // Larger grid cells
      
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.fillStyle = THEME_COLOR;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles (subtle)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.strokeStyle = THEME_COLOR;
            ctx.globalAlpha = 0.1 * (1 - dist / 150);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Mouse interaction
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
            ctx.strokeStyle = THEME_COLOR;
            ctx.globalAlpha = 0.15 * (1 - dist / 250);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden font-sans text-slate-900 bg-white selection:bg-indigo-100 selection:text-indigo-900"
      onMouseMove={handleMouseMove}
    >
      {/* --- Canvas Background --- */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* --- Header --- */}
      <header className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-indigo-600 text-white p-1.5 rounded transition-transform group-hover:rotate-90 duration-500">
            <img src={college} alt="" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">CEC-GRID</span>
        </div>
         
      </header>

      {/* --- Main Content --- */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        
         

        {/* Hero Title */}
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Intelligent Seating, <br />
          <span className="text-indigo-600">Simplified.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg text-lg text-slate-500 mb-10 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Generate conflict-free exam layouts in seconds. 
          Focus on the students, not the spreadsheet.
        </p>

        {/* CTA Button */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => window.href="/"}
            className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </main>

      {/* --- Minimal Login Modal --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsLoginOpen(false)}
          />
          
          <div className="relative w-full max-w-sm bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 animate-scale-up">
            <button 
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={20} />
            </button>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl text-indigo-600 mb-4">
                    <LogIn size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-sm text-slate-500 mt-1">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">User ID</label>
                    <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                    <input 
                        type="password" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 mt-2">
                    Sign In
                </button>

                <div className="text-center mt-4">
                    <a href="#" className="text-sm text-slate-400 hover:text-indigo-600 transition-colors">Forgot password?</a>
                </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}