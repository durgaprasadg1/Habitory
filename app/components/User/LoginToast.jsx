"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
export default function LoginToast() {
  const { user, isLoaded } = useUser();
  const path = usePathname();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !hasShownToast.current) {
      hasShownToast.current = true;
      {path === "/dashboard" && toast.success(
        `Welcome , ${user.firstName || user.username || "User"}! 🎉`,
      );}
    }
  }, [isLoaded, user]);

  return null;
}
