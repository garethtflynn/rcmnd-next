"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaEllipsisVertical } from "react-icons/fa6";

import EditPostModal from "./EditPostModal";

export default function PostItem({
  id,
  title,
  link,
  description,
  image,
  list,
  listId,
  isPrivate,
  deletePostCallback,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeletePost = () => {
    if (deletePostCallback) {
      deletePostCallback(id); // Pass the post ID to the callback function for deletion
    }
    console.log(`Post with ID ${id} deleted.`);
  };

  const handleEditPost = () => {
    // console.log('postID:', id)
    // console.log(`list name: ${list.title}`);
    // console.log(`listID: ${listId}`);
    openModal();
  };

  return (
    <div className="px-1 relative h-72 md:h-96">
      <Link id={id} href={`/post/${id}`}>
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          width="300"
          height="300"
        />
      </Link>
      <div>
        <Menu
          as="div"
          className="absolute top-1 right-1 cursor-default bg-transparent hover:text-[#ECE2D8] duration-1000"
        >
          <MenuButton className="text-sm font-semibold">
            <FaEllipsisVertical
              className="absolute top-1 right-1"
              color="#110A02"
              size={16}
            />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 w-40 origin-top-right bg-[#FBF8F4] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200">
                <p onClick={handleEditPost}>edit post</p>
              </MenuItem>
              <MenuItem className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200">
                <p onClick={handleDeletePost}>delete post</p>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
        {/* modal */}
        <EditPostModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          id={id}
          title={title}
          link={link}
          description={description}
          list={list?.title}
          listId={listId}
          isPrivate={isPrivate}
        />
      </div>
    </div>
  );
}
