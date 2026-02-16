"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen  flex items-center justify-center px-4 bg-slate-950">
        <div className="mt-10">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/user/dashboard"
        appearance={{
            layout: {
      socialButtonsPlacement: "bottom", 
    },
          elements: {
            rootBox: " w-full flex justify-center",
            card: "bg-slate-900 border border-slate-800 shadow-xl rounded-2xl p-8 w-full max-w-md",
            headerTitle: "text-white text-xl font-semibold",
            headerSubtitle: "text-slate-400",
            formFieldInput:
              "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
            socialButtonsBlockButton:
              "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            footer: "bg-transparent border-none",
          },
        }}
      />
      </div>
    </div>
  );
}
