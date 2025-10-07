import Hearder from "@/components/Hearder";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Hearder />
      {children}

      <footer className="flex items-center justify-center py-4">
        © {new Date().getFullYear()} 10mins delivery
      </footer>
    </main>
  );
}
