import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full z-50">
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-spin"></div>
        
        {/* Middle reversing ring */}
        <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-b-purple-500 border-l-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Inner fast ring */}
        <div className="absolute inset-6 rounded-full border-[3px] border-transparent border-t-pink-500 border-r-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.5)] animate-[spin_1s_linear_infinite]"></div>
        
        {/* Center pulse */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse"></div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 flex items-center gap-1 font-semibold text-lg tracking-widest">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          LOADING
        </span>
        <div className="flex gap-1 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
