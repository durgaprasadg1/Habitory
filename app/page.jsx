"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStart = () => {
    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F5F2] text-[#1C1917]">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C08457]/20 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A8A29E]/20 blur-[140px] rounded-full" />

      <section className="relative z-10 px-5 pt-16 pb-20 flex flex-col items-center text-center gap-6">
        <div className="bg-[#E7E5E4] border border-[#A8A29E]/40 rounded-3xl p-8 w-full max-w-md shadow-lg">
          <h1 className="text-3xl font-semibold leading-tight">
            
          </h1>
          <h2 className="text-3xl font-semibold leading-tight">
            Build Discipline.
            <span className="block text-[#C08457]">
              Track Everything.
            </span>
          </h2>

          <p className="mt-4 text-sm text-[#A8A29E] leading-relaxed">
            Monthly goals, daily consistency, powerful analytics and complete
            yearly tracking — all in one professional system.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              className="w-full bg-[#C08457] hover:opacity-90 rounded-xl text-white py-6 text-base"
              onClick={handleGetStart}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-24 flex flex-col gap-6">
        <div className="bg-[#E7E5E4] border border-[#A8A29E]/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1C1917]">
            Monthly Goal System
          </h3>
          <p className="mt-2 text-sm text-[#A8A29E]">
            Set a focused goal each month and measure exact completion with live
            progress charts.
          </p>
        </div>

        <div className="bg-[#E7E5E4] border border-[#A8A29E]/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1C1917]">
            Calendar Tracking
          </h3>
          <p className="mt-2 text-sm text-[#A8A29E]">
            Tick habits daily across all 12 months with automatic leap-year
            support.
          </p>
        </div>

        <div className="bg-[#E7E5E4] border border-[#A8A29E]/40 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1C1917]">
            Advanced Analytics
          </h3>
          <p className="mt-2 text-sm text-[#A8A29E]">
            Weekly summaries, category breakdowns and goal progress
            visualization.
          </p>
        </div>
      </section>

      <footer className="relative z-10 px-5 pb-10 text-center text-xs text-[#A8A29E]">
        © {new Date().getFullYear()} Habitory. All rights reserved.
      </footer>
    </main>
  );
}
