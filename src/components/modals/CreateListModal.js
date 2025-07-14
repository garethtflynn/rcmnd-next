"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Field, Label, Switch } from "@headlessui/react";

function CreateListModal({closeModal}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    isPrivate: false,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const userId = session?.user?.id;
    try {
      const body = { ...formData, userId: userId };
      const res = await fetch("/api/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // console.log("List created!!");
        router.push("/profilePage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrivateToggle = (checked) => {
    setEnabled(checked);

    setFormData((prevData) => ({
      ...prevData,
      isPrivate: checked,
    }));
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-[#D7CDBF] bg-[#000000]">
      <div className="w-full h-2/6 flex flex-col justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col items-center justify-center"
        >
          <input
            defaultValue={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            type="text"
            name="title"
            placeholder="title"
            className="w-1/2 border border-[#D7CDBF] bg-transparent text-[#D7CDBF] px-2 py-1 my-2 rounded focus:within:bg-[#D7CDBF] outline-none placeholder-[#1E1912]"
          />
          <div className="w-1/2">
            <Field className="flex my-2 text-[#1E1912] items-center">
              <Switch
                label="private"
                description="private"
                value="private"
                checked={enabled}
                onChange={handlePrivateToggle}
                className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#D7CDBF]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
              <Label className="pl-2">private</Label>
            </Field>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              onClick={closeModal}
              type="button"
              className="w-1/4 mt-2 bg-transparent hover:text-opacity-50 text-[#FBF8F4] text-opacity-75 hover:text-[#14100E] font-bold py-2 px-4 rounded-md duration-500 mr-2"
            >
              cancel
            </button>
            <button
              type="submit"
              className="w-1/4 mt-2 bg-[#252220] hover:opacity-75 text-[#FBF8F4] font-bold py-2 px-4 rounded-md duration-500"
            >
              create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListModal;
