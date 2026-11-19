import type { ReactNode } from "react";
import "./globals.css";
import "./report-preview.css";
import "./modal-input.css";

export const metadata = {
  title: "Seismic Load Calculator | Linkoteq",
  robots: { index: false, follow: false },
  description: "NBCC 2010 / NBCC 2020 dual-edition seismic calculation interface",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
