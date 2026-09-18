import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lumina AI • Pristine Presentations, Zero Watermarks",
  description:
    "AI document processor to remove Gamma.app watermarks from PowerPoint (.pptx) and PDF files with lossless vector retention.",
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
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <div className="bg-mesh" />
        <div className="bg-grid-overlay" />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
