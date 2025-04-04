"use client"

import React from "react";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "text-slate-900 border border-slate-200 hover:bg-slate-100",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-600",
    success: "bg-green-500 text-slate-50 hover:bg-green-600",
    warning: "bg-yellow-500 text-slate-50 hover:bg-yellow-600",
  };

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge }; 