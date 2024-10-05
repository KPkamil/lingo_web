import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
