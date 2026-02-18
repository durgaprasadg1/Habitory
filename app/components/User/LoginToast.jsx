"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function LoginToast() {
  const { user, isLoaded } = useUser();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.success(
        `Welcome back, ${user.firstName || user.username || "User"}! 🎉`,
      );
    }
  }, [isLoaded, user]);

  return null;
}
