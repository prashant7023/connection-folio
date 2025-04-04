"use client"

import React from "react";

export function StudentStats() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Student Activity</h3>
      <div className="space-y-4">
        <div className="bg-slate-100 p-4 rounded-md">
          <div className="text-sm font-medium text-slate-700 mb-2">Profile Completion</div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-slate-800 h-2.5 rounded-full w-[85%]"></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">85% complete</div>
        </div>
        
        <div className="bg-slate-100 p-4 rounded-md">
          <div className="text-sm font-medium text-slate-700 mb-2">Weekly Connections</div>
          <div className="flex justify-between items-end h-20">
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '40%' }}></div>
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '60%' }}></div>
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '30%' }}></div>
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '80%' }}></div>
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '50%' }}></div>
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '70%' }}></div>
            <div className="w-8 bg-slate-800 rounded-t-sm" style={{ height: '45%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
} 