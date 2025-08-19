import * as React from "react";

const Popover = ({ children }) => <div className="relative">{children}</div>;

const PopoverTrigger = ({ children }) => <div>{children}</div>;

const PopoverContent = ({ children, className }) => (
  <div className={`absolute z-10 bg-white shadow-md border rounded mt-2 ${className}`}>
    {children}
  </div>
);

export { Popover, PopoverTrigger, PopoverContent };
