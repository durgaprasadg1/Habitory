"use client";
import { useRouter } from "next/navigation";

export default function Logo({ size = 40, showText = true }) {
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-3 hover:cursor-pointer"
      onClick={() => router.push("/")}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="#C08457"
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M34 52 L47 65 L72 36"
          stroke="#1C1917"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span className="text-lg font-semibold text-[#1C1917] tracking-wide">
          Habitory
        </span>
      )}
    </div>
  );
}