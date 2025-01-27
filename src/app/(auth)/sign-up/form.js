import React, { useState } from "react";
// import Link from "next/link";
import Alert from "../../../components/Alert";
import { signIn } from "next-auth/react";

function SignUpForm(props) {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        //redirect to
        signIn();
        console.log("RES = OK");
      } else {
        setError((await res.json()).error);
      }
    } catch (error) {
      setError(error?.message);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="flex gap-2 flex-col pt-2">
        <input
          required
          type="text"
          name="firstName"
          placeholder="firstName"
          autocomplete="off"
          onChange={(e) => setFirstName(e.target.value)}
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]"
        />
        <input
          required
          type="text"
          name="lastName"
          placeholder="lastName"
          autocomplete="off"
          onChange={(e) => setLastName(e.target.value)}
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]"
        />
        <input
          required
          type="text"
          name="username"
          placeholder="username"
          autocomplete="off"
          onChange={(e) => setUsername(e.target.value)}
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]"
        />
        <input
          required
          type="text"
          name="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]"
        />
        <input
          required
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]"
        />
        {error && <Alert>{error}</Alert>}
        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="w-64 bg-[#ECE2D8] hover:bg-[#4C4138] text-[#110A02] font-bold py-2 px-4 rounded-md duration-500"
          >
            sign up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
