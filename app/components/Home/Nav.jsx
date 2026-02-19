"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Logo from "../Brand/Logo";
import { LogOut, Home, BarChart3, History, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AuthNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    toast.success("Logged out successfully!");
    await signOut({ redirectUrl: "/" });
  };

  const navItems = [
    { href: "/dashboard", icon: Home },
    { href: "/analytics", icon: BarChart3 },
    { href: "/history", icon: History },
    {href : '/profile', icon: User}
  ];

  return (
    <nav className="w-full border-b border-[#A8A29E]/40 bg-[#F8F5F2]">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo size={25} />

        {!isSignedIn ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/sign-up")}
              className="border border-[#A8A29E]/50 text-[#1C1917] bg-[#E7E5E4] hover:bg-[#C08457] hover:text-white rounded-lg px-3 text-sm"
            >
              Register
            </Button>

            <Button
              onClick={() => router.push("/sign-in")}
              className="bg-[#C08457] hover:opacity-90 text-white rounded-lg px-3 text-sm"
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center justify-center transition-colors ${
                      active
                        ? "text-[#C08457]"
                        : "text-[#A8A29E] hover:text-[#1C1917]"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`transition-transform ${
                        active ? "scale-110" : "scale-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
            <Button
              onClick={handleLogout}
              size="icon"
              className="bg-[#DC2626] hover:opacity-90 text-white rounded-lg"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
