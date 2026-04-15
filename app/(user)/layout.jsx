import LoginToast from "../components/User/LoginToast";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Script from "next/script";

export default async function UserLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <LoginToast />

      <div className="min-h-screen bg-[#F8F5F2] text-[#1C1917] overflow-hidden">
        <main className="relative z-10 px-4 pb-24">
          {children}
        </main>
      </div>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
    </>
  );
}