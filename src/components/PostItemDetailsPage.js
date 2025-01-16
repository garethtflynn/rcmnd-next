"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function PostItemDetailsPage({
  id,
  title,
  link,
  description,
  image,
  deletePostCallback,
}) {
  const handleDeletePost = () => {
    if (deletePostCallback) {
      deletePostCallback(id);
    }
    console.log(`Post with ID ${id} deleted.`);
    router.push("/homeFeed");
  };

  return (
    <div
      id={id}
      className="h-screen w-full bg-[#110A02] place-content-center px-1 relative text-white md:grid md:grid-cols-2"
    >
      <div className="relative place-items-center">
        <Image
          className="w-fit h-full object-contain"
          src={image}
          alt={title}
          width="300"
          height="300"
        />
      </div>
      <div className="place-content-center">
        <h1 className="place-self-center text-2xl">notes</h1>
        <div className="border p-2 mx-1 ">
          <p className="text-lg">{title}</p>
          <br />
          <Link
            href={link}
            target="_blank"
            className="hover:italic hover:opacity-50"
          >
            <p>Link</p>
          </Link>
          <br />
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
