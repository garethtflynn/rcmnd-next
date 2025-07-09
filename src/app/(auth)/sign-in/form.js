import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";
import Alert from "@/components/Alert";

function LoginForm(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/homeFeed";
  const [error, setError] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError(res?.error || "Invalid email or password");
      }
    } catch (error) {
      setError(error?.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl,
      });
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 ">
        <input
          type="text"
          name="email"
          placeholder="email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          className="border border-[#D7CDBF] bg-transparent text-[#D7CDBF] px-2 py-1 my-1 rounded hover:bg-[#4C4138] focus:within:bg-[#D7CDBF] outline-none placeholder-[#4C4138]"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#D7CDBF] bg-transparent text-[#D7CDBF] px-2 py-1 rounded hover:bg-[#4C4138] focus:within:bg-[#D7CDBF] outline-none placeholder-[#4C4138]"
        />
        {error && <Alert>{error}</Alert>}
        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="w-64 bg-[#D7CDBF] hover:bg-[#4C4138] text-[#000000] font-bold py-2 px-4 rounded-md duration-500"
          >
            sign in
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-4">
        <div className="border-t border-[#4C4138] flex-grow"></div>
        <span className="px-3 text-[#4C4138] text-sm">or</span>
        <div className="border-t border-[#4C4138] flex-grow"></div>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-64 bg-transparent border border-[#D7CDBF] text-[#D7CDBF] hover:bg-[#4C4138] font-bold py-2 px-4 rounded-md duration-500 flex items-center justify-center gap-2"
        >
          sign in with Google
          <FcGoogle />
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
