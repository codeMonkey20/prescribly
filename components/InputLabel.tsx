import React, { forwardRef } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { InputProps } from "./ui/input";

const InputLabel = forwardRef<HTMLInputElement, InputProps>(
  ({ className, name, children, required, ...props }, ref) => {
    return (
      <div className={cn("grid grow items-center gap-1.5", className)}>
        <Label htmlFor={name}>
          {children}
          {required ? <span className="text-destructive ml-0.5">*</span> : ""}
        </Label>
        <Input id={name} name={name} ref={ref} required={required} {...props} />
      </div>
    );
  }
);
InputLabel.displayName = "InputLabel";
export { InputLabel };
