// app/layout.tsx
import "./globals.css";
import ProtectedLayout from "./ProtectedLayout";
import {Providers} from "./Providers";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PosPort",
  description: "Created by Umer Siddiqui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en">
      <body suppressHydrationWarning={true}  className={inter.className}>
          <Providers>
            <ProtectedLayout>
              {children}
              <Toaster />
            </ProtectedLayout>
          </Providers>
      </body>
    </html>
  );
}
