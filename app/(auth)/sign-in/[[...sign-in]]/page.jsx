"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F5F2]">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}