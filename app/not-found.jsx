import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6  text-black text-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center"></div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Opps! 404</h1>
          <p className="text-slate-400 text-sm">
            This page is not found. The page you are looking for might have been
            removed or does not exist.
          </p>
        </div>

        <Link href="/">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-xl">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
