import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GTA Car Meets",
  description: "Gestiona tus coches modificados y quedadas",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white min-h-screen pb-20">
        <AppProvider>
          {children}
          <Navbar />
        </AppProvider>
      </body>
    </html>
  );
}
