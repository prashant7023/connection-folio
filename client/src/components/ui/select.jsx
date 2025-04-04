"use client"

import React, { createContext, useContext, useState } from "react";

const SelectContext = createContext({});

const Select = ({ children, onValueChange, defaultValue }) => {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, handleValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ className, children, ...props }) => {
  const { value, open, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 opacity-50 ${open ? "rotate-180" : ""}`}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
};

const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ className, children, ...props }) => {
  const { open } = useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <div
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md ${className}`}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

const SelectItem = ({ className, children, value, ...props }) => {
  const { value: selectedValue, handleValueChange } = useContext(SelectContext);
  
  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
        selectedValue === value ? "bg-slate-100" : ""
      } ${className}`}
      onClick={() => handleValueChange(value)}
      {...props}
    >
      {selectedValue === value && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-2 h-4 w-4"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
      {children}
    </div>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }; 