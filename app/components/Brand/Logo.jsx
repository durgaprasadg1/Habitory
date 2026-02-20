"use client"
import { useRouter } from "next/navigation";
export default function Logo({ size = 40, showText = true }) {
  const router= useRouter();
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
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
          d="M35 52 L47 64 L70 38"
          stroke="#1C1917"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className="text-lg font-semibold text-[#1C1917] tracking-wide hover:cursor-pointer" onClick={()=> router.push("/")}>
          Habitory
        </span>
      )}
    </div>
  );
}
