"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Logo from "./components/Brand/Logo";
import Link from "next/link";

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

      <footer className="w-full border-t border-[#A8A29E]/40 bg-[#F8F5F2] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        <div className="space-y-4">
          <Logo size={24} />
          <p className="text-sm text-[#78716C] leading-relaxed max-w-md">
            A disciplined system for tracking habits, monthly goals,
            and long-term consistency — built for structured growth.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">

          <div className="space-y-3">
            <h4 className="text-[#1C1917] font-medium">Product</h4>
            <ul className="space-y-2 text-[#78716C]">
              <li>
                <Link href="/dashboard" className="hover:text-[#C08457] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#C08457] transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#C08457] transition-colors">
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[#1C1917] font-medium">Account</h4>
            <ul className="space-y-2 text-[#78716C]">
              <li>
                <Link href="/sign-in" className="hover:text-[#C08457] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#C08457] transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-[#A8A29E]/30 flex flex-col gap-2 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} Habitory. All rights reserved.</p>
          <p>Designed for disciplined progress.</p>
        </div>

      </div>
    </footer>
    </main>
  );
}

