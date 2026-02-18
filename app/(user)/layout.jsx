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
     
      <div className=" min-h-screen bg-[#F8F5F2] text-[#1C1917] overflow-hidden">
        <main className="relative z-10 px-4 pb-24 ">
          {children}
        </main>
      </div>
    </>
  );
}
