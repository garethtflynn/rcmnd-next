"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaX } from "react-icons/fa6";

function CreateList(props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();
    const userId = session?.user?.id;
    try {
      const body = { title: title, userId: userId };
      const res = await fetch("/api/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // ill want this to redirect to profile page
        console.log("List created!!");
        router.push("/homeFeed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleXclick = async () => {
    router.back();
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-[#FBF8F4] bg-[#110A02]">
      <div className="flex flex-row-reverse items-end w-3/5">
        <FaX
          aria-hidden="true"
          color="#FBF8F4"
          className="contactIcon h-5 w-5 cursor-pointer"
          onClick={handleXclick}
        />
      </div>

      <div className="w-full h-2/6 flex flex-col justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col items-center justify-center"
        >
          <input
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            name="title"
            placeholder="title"
            autoComplete="off"
            className="w-1/2 border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-2 rounded hover:bg-[#4C4138] focus:within:bg-[#ECE2D8] outline-none placeholder-[#4C4138]"
          />
          <button
            type="submit"
            className="w-1/4 mt-2 bg-[#ECE2D8] hover:bg-[#4C4138] text-[#110A02] font-bold py-2 px-4 rounded-md duration-500"
          >
            create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateList;
