import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./global.css";
import TransitionProvider from "@/components/transitionProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sohad Dev Portfolio App",
  description: "The best animated portfolio page",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
