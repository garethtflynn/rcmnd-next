"use client";

import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./form";

export default function Page() {
  return (
    <div className="w-full h-screen bg-[#110A02] flex flex-col justify-center items-center text-[#FBF8F4]">
      <h1 className="font-semibold text-2xl text-[#ECE2D8] pb-2">
        sign In to rcmnd
      </h1>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="pt-2">
        don`t have an account?{" "}
        <Link
          className="text-[#ECE2D8] hover:text-[#513C2C] hover:underline decoration-2 duration-500"
          href="/sign-up"
        >
          sign Up.
        </Link>
      </p>
    </div>
  );
}
