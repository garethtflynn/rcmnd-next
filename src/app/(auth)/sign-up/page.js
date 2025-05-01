"use client";

import { Suspense } from "react";
import Link from "next/link";
import SignUpForm from "./form";

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#000000] flex flex-col justify-center items-center text-[#D7CDBF]">
      <h1 className="font-semibold text-2xl text-[#D7CDBF]">
        create your rcmnd Account
      </h1>
      <Suspense>
        <SignUpForm />
      </Suspense>
      <p className="pt-2 text-[#D7CDBF]">
        already have an account?{" "}
        <Link
          className="hover:text-[#4C4138] hover:underline decoration-2 duration-500"
          href="/sign-in"
        >
          Sign In.
        </Link>
      </p>
    </div>
  );
}
