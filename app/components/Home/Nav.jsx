"use client";

import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Logo from "../Brand/Logo";
import Image from "next/image";
export default function AuthNavbar() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const handleLogin = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return (
    <nav className="relative z-10 flex items-center justify-between px-5 py-4 bg-[#F8F5F2] border-b border-[#A8A29E]/40">
      <Logo size={36} />

      {!isSignedIn ? (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSignUp}
            className="border border-[#A8A29E]/50 text-[#1C1917] bg-[#E7E5E4] hover:bg-[#C08457] hover:text-white rounded-xl px-4 text-sm transition-colors"
          >
            Register
          </Button>

          <Button
            onClick={handleLogin}
            className="bg-[#C08457] hover:opacity-90 text-white rounded-xl px-4 text-sm"
          >
            Login
          </Button>
        </div>
      ) : (<>
        
      <Button
          onClick={handleLogout}
          className="bg-[#DC2626] hover:opacity-90 text-white rounded-xl px-4 text-sm"
        >
          Logout
        </Button>
      </>
        
      )}
    </nav>
  );
}
