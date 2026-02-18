"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, History } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home },
  { href: "/analytics", icon: BarChart3 },
  { href: "/history", icon: History },
];

export default function Navbar() {
  

  return (
    <nav className="bottom-0 left-0 right-0 z-50 bg-[#c5bbaf] border-t border-[#A8A29E]/40">
      
    </nav>
  );
}
