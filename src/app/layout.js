import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ExtensionAuthConnector } from "@/components/extensions/ExtensionAuthConnector";
import HeaderWithPathname from "@/components/common/HeaderWithPathname";
import {Footer} from "@/components/common";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  description: "rcmnd your favorite things & places",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#000000]`}>
        <Providers>
          <HeaderWithPathname />
          <ExtensionAuthConnector />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
