"use client"

import { useRouter } from "next/navigation"
import { useAuth, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function AuthNavbar() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()

  const handleLogin = () => {
    router.push("/sign-in")
  }

  const handleSignUp = () => {
    router.push("/sign-up")
  }

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" })
  }

  return (
    <nav className="relative z-10  flex items-center justify-between px-5 py-4">
      <h1 className="text-md tracking-widest text-white/70 font-bold">
       Habitory
      </h1>

      {!isSignedIn ? (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSignUp}
            className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl px-4 text-sm"
          >
            Register
          </Button>

          <Button
            onClick={handleLogin}
            className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl px-4 text-sm"
          >
            Login
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleLogout}
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl px-4 text-sm"
        >
          Logout
        </Button>
      )}
    </nav>
  )
}
