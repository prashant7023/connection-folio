"use client"

import React from "react";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild, ...props }, ref) => {
    const variantStyles = {
      default: "bg-slate-900 text-slate-50 hover:bg-slate-800",
      destructive: "bg-red-500 text-slate-50 hover:bg-red-600",
      outline: "border border-slate-200 hover:bg-slate-100 hover:text-slate-900",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-slate-900 underline-offset-4 hover:underline",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? (props.children.type) : "button";

    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 