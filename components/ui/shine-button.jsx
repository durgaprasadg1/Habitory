"use client";

import { cn } from "@/lib/utils";

export default function ShineButton({
  children,
  className,
  ...props
}) {
  return (
    <button
      {...props}
      className={cn(
        "relative w-full sm:w-auto",
        "min-h-[44px] px-5 py-1",
        "rounded-xl text-sm font-medium text-white",
        "bg-[#C08457]",
        "transition-all duration-300",
        "hover:bg-[#b6734b]",
        "active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-[#C08457]/40",
        "overflow-hidden group",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      <span
        className="
          pointer-events-none
          absolute inset-0
          before:absolute
          before:top-0
          before:-left-[120%]
          before:h-full
          before:w-[60%]
          before:rotate-12
          before:bg-white/40
          before:blur-sm
          before:transition-all
          before:duration-700
          group-hover:before:left-[120%]
          group-active:before:left-[120%]
        "
      />
    </button>
  );
}