import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ExtensionAuthConnector } from "@/components/extensions/ExtensionAuthConnector";
import HeaderWithPathname from "@/components/common/HeaderWithPathname";
import { Footer } from "@/components/common";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "rcmnd",
  description: "rcmnd your favorite things & places",
  icons: {
    icon: "/favicon.ico",
    apple: [
      {
        url: "/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
      </head>
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
