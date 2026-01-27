import React, { useState } from 'react';
import { RefreshCw, Code, Layout, Circle, Activity } from 'lucide-react';

// --- Loader Components ---

// 1. Classic Spinner
const ClassicSpinner = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
    <span className="mt-3 text-sm font-medium text-slate-500">Loading...</span>
  </div>
);

// 2. Dual Ring Spinner
const DualRingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-500 border-b-purple-500 animate-spin"></div>
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-l-pink-500 border-r-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
    <span className="mt-3 text-sm font-medium text-slate-500">Preparing…</span>
  </div>
);

// 3. Bouncing Dots
const BouncingDots = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
    </div>
    <span className="mt-3 text-sm font-medium text-slate-500">Syncing data</span>
  </div>
);

// 4. Pulsing Radar
const PulsingRadar = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="relative flex items-center justify-center w-12 h-12">
      <div className="absolute w-full h-full bg-rose-400 rounded-full opacity-75 animate-ping"></div>
      <div className="relative w-4 h-4 bg-rose-600 rounded-full"></div>
    </div>
    <span className="mt-3 text-sm font-medium text-slate-500">Searching</span>
  </div>
);

// 5. Gradient Bar
const GradientBar = () => (
  <div className="flex flex-col items-center justify-center p-4 w-full max-w-xs">
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full origin-left" style={{ 
        animation: 'progress 1.5s ease-in-out infinite' 
      }}></div>
    </div>
    
    {/* Inline style for custom keyframes since we can't edit tailwind.config */}
    <style>{`
      @keyframes progress {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0); }
        100% { transform: translateX(100%); }
      }
    `}</style>
    <span className="mt-3 text-sm font-medium text-slate-500">Updating</span>
  </div>
);

// 6. Skeleton Loader
const SkeletonLoader = () => (
  <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-sm border border-slate-100">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-slate-200 h-10 w-10"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// 7. Spinning Square (Cube Grid)
const CubeGrid = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="grid grid-cols-2 gap-1 w-10 h-10 rotate-45">
      <div className="w-full h-full bg-amber-500 animate-pulse"></div>
      <div className="w-full h-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-full h-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      <div className="w-full h-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
    </div>
    <span className="mt-5 text-sm font-medium text-slate-500">Computing</span>
  </div>
);

// 8. Typing Indicator
const TypingIndicator = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
        <div className="flex space-x-1.5">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }}></div>
        </div>
    </div>
    <span className="mt-3 text-sm font-medium text-slate-500">Typing...</span>
  </div>
);


const LoaderCard = ({ title, component: Component }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
      <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
      <Code size={14} className="text-slate-400" />
    </div>
    <div className="p-6 flex-1 flex items-center justify-center bg-white min-h-40">
      <Component />
    </div>
  </div>
);

export {LoaderCard,TypingIndicator,CubeGrid,SkeletonLoader,GradientBar,PulsingRadar,BouncingDots,DualRingSpinner,ClassicSpinner}
