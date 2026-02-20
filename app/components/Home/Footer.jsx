import Logo from "../Brand/Logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#A8A29E]/40 bg-[#F8F5F2] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        <div className="space-y-4">
          <Logo size={24} />
          <p className="text-sm text-[#78716C] leading-relaxed max-w-md">
            A disciplined system for tracking habits, monthly goals,
            and long-term consistency — built for structured growth.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">

          <div className="space-y-3">
            <h4 className="text-[#1C1917] font-medium">Product</h4>
            <ul className="space-y-2 text-[#78716C]">
              <li>
                <Link href="/dashboard" className="hover:text-[#C08457] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-[#C08457] transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#C08457] transition-colors">
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[#1C1917] font-medium">Account</h4>
            <ul className="space-y-2 text-[#78716C]">
              <li>
                <Link href="/sign-in" className="hover:text-[#C08457] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#C08457] transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-[#A8A29E]/30 flex flex-col gap-2 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} Habitory. All rights reserved.</p>
          <p>Designed for disciplined progress.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer