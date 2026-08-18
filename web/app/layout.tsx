import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CNBC Seismic Calculator",
  description: "NBCC 2010 / NBCC 2020 dual-edition seismic calculation interface",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
