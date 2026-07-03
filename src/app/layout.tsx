import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Smart Trade RDC",
  description: "Tax incentives and cross-border trade for investors in DRC",
};

import { GlobalStateProvider } from "../context/GlobalStateContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  );
}
