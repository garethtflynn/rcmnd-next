"use client";

import { Suspense } from "react";
import Link from "next/link";
import SignUpForm from "./form";

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#110A02] flex flex-col justify-center items-center text-[#FBF8F4]">
      <h1 className="font-semibold text-2xl text-[#ECE2D8]">
        Create your rcmnd Account
      </h1>
      <Suspense>
        <SignUpForm />
      </Suspense>
      <p className="pt-2 text-[#FBF8F4]">
        Already have an account?{" "}
        <Link
          className="hover:text-[#513C2C] hover:underline decoration-2 duration-500"
          href="/sign-in"
        >
          Sign In.
        </Link>
      </p>
    </div>
  );
}
