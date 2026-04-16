import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "./components/Home/Nav";
import { Toaster } from "sonner";
import Footer from "./components/Home/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Habitory",
  description: "Track habits, build discipline.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#C08457" },
      }}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      dynamic
    >
      <html lang="en" className="h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-[#1C1917] dark:text-white`}
        >
          <Nav />
          <Toaster position="bottom-center" richColors />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
