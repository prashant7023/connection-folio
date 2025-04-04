"use client"

import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({});

const Tabs = ({ defaultValue, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div {...props} />
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, ...props }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 ${className}`}
      role="tablist"
      {...props}
    />
  );
};

const TabsTrigger = ({ value, className, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      role="tab"
      className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        activeTab === value
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:text-slate-900"
      } ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 