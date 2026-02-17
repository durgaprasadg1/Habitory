import Navbar from "../components/User/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#F8F5F2] text-[#1C1917] overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C08457]/20 blur-[140px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A8A29E]/20 blur-[140px] rounded-full" />

        <main className="relative z-10 px-4 pb-24 pt-20">
          {children}
        </main>
      </div>
    </>
  );
}
