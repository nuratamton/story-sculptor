import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./lib/providers";
import { fonts } from "./lib/fonts";

export const metadata: Metadata = {
  title: "Story Sculptor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={fonts.rubik}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

