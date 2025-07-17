// app/layout.tsx
import "./globals.css";
import ProtectedLayout from "./ProtectedLayout";
import Providers from "./Providers";
// 👈 path sahi hona chahiye

export const metadata = {
  title: "PosPort",
  description: "Created by Umer Siddiqui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
     <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </Providers>
      </body>
    </html>
  );
}
