// app/layout.tsx
import "./globals.css";
import ProtectedLayout from "./ProtectedLayout";
import {Providers} from "./Providers";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google"
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PosPort",
  description: "Created by Umer Siddiqui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className={inter.className}>
          <ErrorBoundary>
            <Providers>
              <ProtectedLayout>
                {children}
                <Toaster />
              </ProtectedLayout>
            </Providers>
          </ErrorBoundary>
      </body>
    </html>
  );
}
