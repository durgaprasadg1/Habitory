"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      sendSigninEmail(user);
    }
  }, [isSignedIn]);

  const sendSigninEmail = async (user) => {
    try {
      const response = await fetch("/api/send-signin-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          name: user.firstName,
        }),
      });

      console.log("Email sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8F5F2]">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}