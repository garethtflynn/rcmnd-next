"use client";

import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./form";

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#000000] flex flex-col justify-center items-center text-[#D7CDBF]">
      <h1 className="font-semibold text-2xl text-[#D7CDBF] pb-2">
        sign In to rcmnd
      </h1>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="pt-2">
        don`t have an account?{" "}
        <Link
          className="text-[#D7CDBF] hover:text-[#4C4138] hover:underline decoration-2 duration-500"
          href="/sign-up"
        >
          sign Up.
        </Link>
      </p>
    </div>
  );
}
