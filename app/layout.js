import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/shared/providers/Providers";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Twitter Clone App",
  description:
    "A Twitter clone application built with Next JS and MongoDB. This application serves as the final project in FullStack Bootcamp in ReDI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col mx-auto">
        <Toaster />
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
