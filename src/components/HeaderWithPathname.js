"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function HeaderWithPathname() {
  const pathname = usePathname();
  const shouldHideHeader = ["/sign-in", "/sign-up", "/welcome"].includes(pathname);
  
  if (shouldHideHeader) return null;

  return <Header />;
}