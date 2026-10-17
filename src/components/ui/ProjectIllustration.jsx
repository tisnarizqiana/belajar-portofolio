import React from 'react';
import { CheckSquare, ShoppingBag, CloudSun } from 'lucide-react';

/**
 * Clean SVG/CSS-based project preview graphics avoiding generic external stock images
 */
export const ProjectIllustration = ({ theme = 'tasks' }) => {
  if (theme === 'tasks') {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-[#0B1F3A] to-[#071426] border-b border-[#1E3A5F] flex flex-col justify-between p-4 relative overflow-hidden group-hover:border-sky-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          </div>
          <span className="text-[10px] font-mono text-sky-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">Task Manager</span>
        </div>
        
        {/* Mock Task Rows */}
        <div className="space-y-2 my-auto">
          <div className="bg-[#0B1F3A]/90 p-2 rounded border border-[#1E3A5F] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <div className="w-28 h-2 bg-slate-400/40 rounded"></div>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Done</span>
          </div>
          <div className="bg-[#0B1F3A]/90 p-2 rounded border border-[#1E3A5F] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-sky-400 inline-block"></span>
              <div className="w-36 h-2 bg-slate-400/40 rounded"></div>
            </div>
            <span className="text-[10px] text-sky-400 font-mono">In Progress</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 truncate">
          &gt; PostgreSQL CRUD Operations
        </div>
      </div>
    );
  }

  if (theme === 'shop') {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-[#0B1F3A] to-[#071426] border-b border-[#1E3A5F] flex flex-col justify-between p-4 relative overflow-hidden group-hover:border-sky-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          </div>
          <span className="text-[10px] font-mono text-sky-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">E-Commerce UI</span>
        </div>

        {/* Mock Shopping Grid */}
        <div className="grid grid-cols-2 gap-2 my-auto">
          <div className="bg-[#0B1F3A]/90 p-2 rounded border border-[#1E3A5F] flex flex-col gap-1.5">
            <div className="w-full h-8 bg-sky-950/50 rounded flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-sky-400" />
            </div>
            <div className="w-16 h-1.5 bg-slate-400/40 rounded"></div>
            <div className="w-10 h-1.5 bg-emerald-400/60 rounded"></div>
          </div>
          <div className="bg-[#0B1F3A]/90 p-2 rounded border border-[#1E3A5F] flex flex-col gap-1.5">
            <div className="w-full h-8 bg-indigo-950/50 rounded flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="w-14 h-1.5 bg-slate-400/40 rounded"></div>
            <div className="w-10 h-1.5 bg-emerald-400/60 rounded"></div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 truncate">
          &gt; Cart State & Dynamic Filtering
        </div>
      </div>
    );
  }

  if (theme === 'api') {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-[#0B1F3A] to-[#071426] border-b border-[#1E3A5F] flex flex-col justify-between p-4 relative overflow-hidden group-hover:border-sky-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">REST API</span>
        </div>

        {/* Mock API Endpoints */}
        <div className="space-y-1.5 font-mono text-[10px] my-auto">
          <div className="flex items-center gap-2 bg-[#0B1F3A]/90 p-1.5 rounded border border-[#1E3A5F]">
            <span className="text-emerald-400 font-bold">GET</span>
            <span className="text-slate-300">/api/v1/posts</span>
            <span className="ml-auto text-emerald-400">200 OK</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B1F3A]/90 p-1.5 rounded border border-[#1E3A5F]">
            <span className="text-sky-400 font-bold">POST</span>
            <span className="text-slate-300">/api/v1/posts</span>
            <span className="ml-auto text-sky-400">201 CREATED</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 truncate">
          &gt; Express.js + PostgreSQL Routing
        </div>
      </div>
    );
  }

  // Fallback: weather
  return (
    <div className="w-full h-44 bg-gradient-to-br from-[#0B1F3A] to-[#071426] border-b border-[#1E3A5F] flex flex-col justify-between p-4 relative overflow-hidden group-hover:border-sky-500/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
        </div>
        <span className="text-[10px] font-mono text-sky-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">Weather API</span>
      </div>

      <div className="flex items-center justify-around my-auto">
        <div className="p-3 bg-sky-950/40 rounded-xl border border-sky-800/40">
          <CloudSun className="w-8 h-8 text-amber-300" />
        </div>
        <div className="text-left font-mono">
          <div className="text-2xl font-bold text-slate-100">28°C</div>
          <div className="text-[10px] text-sky-300">Jakarta, ID - Clear</div>
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-400 truncate">
        &gt; Async Fetch & Error Handling
      </div>
    </div>
  );
};
