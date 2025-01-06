"use client";
import Image from "next/image";
import Link from "next/link";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function PostItem({
  id,
  title,
  link,
  description,
  image,
  deletePostCallback,
}) {

  const handleDeletePost = () => {
    if (deletePostCallback) {
      deletePostCallback(id); // Pass the post ID to the callback function for deletion
    }
    console.log(`Post with ID ${id} deleted.`);
  };
  return (
    <div id={id} className="px-1 relative">
      <Link href={link} target="_blank">
        <Image
          className="w-full h-64 object-cover rounded"
          src={image}
          alt={title}
          width="300"
          height="300"
        />
      </Link>
      <div>
        <Menu
          as="div"
          className="absolute top-1 right-1 cursor-text bg-transparent hover:text-[#ECE2D8] duration-1000"
        >
          <MenuButton className=" text-sm font-semibold">
            <FaEllipsisVertical
              className="absolute top-1 right-1 cursor-text"
              color="black"
              size={16}
            />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 w-40 origin-top-right bg-[#FBF8F4] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200 close">
                <p>edit post</p>
              </MenuItem>
              <MenuItem>
                <p onClick={handleDeletePost} className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200">
                  delete post
                </p>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
}
