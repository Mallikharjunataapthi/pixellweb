import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { UserContextProvider } from "@/context/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixellab App",
  description: "Generated by Pixellab App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContextProvider>
          <div className="min-h-screen flex flex-col">
            <div className="w-full">
              <Navbar />
            </div>
            <div className="flex flex-grow flex-col">{children}</div>
          </div>
        </UserContextProvider>
      </body>
    </html>
  );
}
