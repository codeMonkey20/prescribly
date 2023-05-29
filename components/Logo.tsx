import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Image from "next/image";
import React from "react";

type Props = {
  className?: ClassValue;
};

export default function Logo({ className }: Props) {
  return (
    <div className={cn("absolute bottom-0 right-0 p-1 bg-transparent", className)}>
      <div className="flex justify-center items-center gap-1 h-full rounded-r-3xl">
        <div className="text-right">
          <p className="font-semibold text-md">PRESCRIBLY</p>
          <p className="text-xs">Prescription made easy.</p>
        </div>
        <Image src="/logo.png" alt="logo" width={40} height={40} className="w-auto" />
      </div>
    </div>
  );
}
