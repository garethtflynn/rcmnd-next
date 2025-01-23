import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Alert from "@/components/Alert";

function LoginForm(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const callbackUrl = router.query.callbackUrl || '/homeFeed'; // Use query params or default to '/homeFeed'
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
      console.log(res); // Debugging: Inspect the response

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError(res?.error || "Invalid email or password");
      }
    } catch (error) {
      setError(error?.message);
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
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C]"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C]"
        />
        {error && <Alert>{error}</Alert>}
        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="w-64 bg-[#ECE2D8] hover:bg-[#513C2C] text-[#110A02] font-bold py-2 px-4 rounded-md duration-500"
          >
            sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
