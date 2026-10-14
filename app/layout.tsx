import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diverdino · Tu lugar de celebraciones",
  description: "Celebraciones y cumpleaños infantiles en Elche.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
