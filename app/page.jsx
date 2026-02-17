"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  const handleGetStart = () => {
    router.push("/dashboard");
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#0B0F2A] via-[#11183C] to-[#0E1433] text-white">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full" />

      <section className="relative z-10 px-5 pt-16 pb-20 flex flex-col items-center text-center gap-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          <h2 className="text-3xl font-semibold leading-tight">
            Build Discipline.
            <span className="block bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Track Everything.
            </span>
          </h2>

          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Monthly goals, daily consistency, powerful analytics and complete
            yearly tracking — all in one professional system.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 rounded-xl text-white py-6 text-base"
              onClick={() => handleGetStart()}
            >
              Get Started
            </Button>

            
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-24 flex flex-col gap-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">Monthly Goal System</h3>
          <p className="mt-2 text-sm text-white/70">
            Set a focused goal each month and measure exact completion with live
            progress charts.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">Calendar Tracking</h3>
          <p className="mt-2 text-sm text-white/70">
            Tick habits daily across all 12 months with automatic leap-year
            support.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">Advanced Analytics</h3>
          <p className="mt-2 text-sm text-white/70">
            Weekly summaries, category breakdowns and goal progress
            visualization.
          </p>
        </div>
      </section>

      <footer className="relative z-10 px-5 pb-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Habit Tracker. All rights reserved.
      </footer>
    </main>
  );
}
