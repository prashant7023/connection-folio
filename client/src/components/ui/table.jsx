"use client"

import React from "react";

const Table = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => {
  return <thead ref={ref} className={`${className}`} {...props} />;
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={`${className}`} {...props} />;
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={`bg-slate-50 font-medium text-slate-900 ${className}`}
      {...props}
    />
  );
});
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={`border-b border-slate-200 transition-colors hover:bg-slate-50 ${className}`}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={`h-12 px-4 text-left align-middle font-medium text-slate-500 ${className}`}
      {...props}
    />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={`p-4 align-middle ${className}`}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell }; 