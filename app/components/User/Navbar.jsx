"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BarChart3, History, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home },
  { href: "/analytics", icon: BarChart3 },
  { href: "/history", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      

      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between px-6 py-3">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={i}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 text-xs transition ${
                  active ? "text-indigo-400" : "text-white/50 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition ${active ? "scale-110" : "scale-100"}`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}