import type { Metadata } from "next";
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

export const metadata: Metadata = { 
  title: "Habitory",
  description: "Track habits, build discipline.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#C08457" },
      }}
      dynamic
    >
      <html lang="en" className="h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen  text-white`}
        >
          <Nav />
          <Toaster position="bottom-center" richColors />
          {children}
           <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
