import { createElement } from "react";
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
    <html lang="en" data-linkoteq-surface="seismic">
      <head>
        <link rel="stylesheet" href="https://www.linkoteq.com/design-system/linkoteq-shell-v1.css" />
        <script defer src="https://www.linkoteq.com/design-system/linkoteq-header-v1.js" />
      </head>
      <body>{createElement("linkoteq-header")}{children}</body>
    </html>
  );
}
