import Navbar from "../components/User/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function UserLayout({ children }) {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-inear-to-br from-[#0B0F2A] via-[#11183C] to-[#0E1433] text-white overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 blur-[140px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full" />

        <main className="relative z-10 px-4 pb-24 pt-20">{children}</main>
      </div>
    </>
  );
}
