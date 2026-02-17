"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F5F2]">
      <div className="mt-10">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          appearance={{
            layout: {
              socialButtonsPlacement: "bottom",
            },
            elements: {
              rootBox: "w-full flex justify-center",
              card:
                "bg-[#E7E5E4] border border-[#A8A29E]/40 shadow-xl rounded-2xl p-8 w-full max-w-md",
              headerTitle:
                "text-[#1C1917] text-xl font-semibold",
              headerSubtitle:
                "text-[#A8A29E]",
              formFieldInput:
                "bg-white border border-[#A8A29E]/50 text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#C08457] focus:ring-1 focus:ring-[#C08457]",
              formButtonPrimary:
                "bg-[#C08457] hover:opacity-90 text-white",
              socialButtonsBlockButton:
                "bg-white border border-[#A8A29E]/50 text-[#1C1917] hover:bg-[#E7E5E4]",
              footerActionLink:
                "text-[#C08457] hover:opacity-80",
              footer: "bg-transparent border-none",
            },
          }}
        />
      </div>
    </div>
  );
}
