// post item list pages
"use client";
import React, { useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";

import { AppImage } from "@/components/common";
import { EditPostModal } from "@/components/modals";

function PostItemListPage({
  post,
  deletePostCallback,
  list,
  listId,
  isPrivate,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const router = useRouter();
  if (!post) return null;

  const handleDeletePost = async () => {
    try {
      // Sending a DELETE request to the API
      const response = await fetch(`/api/post/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      if (deletePostCallback) {
        deletePostCallback(post.id);
      }
      // console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = () => {
    // console.log('postID:', id)
    // console.log(`list name: ${list.title}`);
    // console.log(`listID: ${listId}`);
    openModal();
  };

  return (
    <div className="rounded-lg">
      {post.image && (
        <div className="relative ">
          <AppImage
            src={post.image}
            alt={post.title || "Post image"}
            className="rounded-lg w-full h-full"
          />
          <Menu
            as="div"
            className="absolute top-1 right-1 cursor-default bg-transparent hover:text-[#D7CDBF] duration-1000"
          >
            <MenuButton className="text-sm font-semibold">
              <FaEllipsisVertical
                className="absolute top-1 right-1"
                color="#000000"
                size={16}
              />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 w-40 origin-top-right bg-[#000000] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] font-semibold hover:opacity-25">
                  <p onClick={handleEditPost}>edit post</p>
                </MenuItem>
                <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] font-semibold hover:opacity-25">
                  <p onClick={handleDeletePost}>delete post</p>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <EditPostModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            id={post.id}
            title={post.title}
            image={post.image}
            link={post.link}
            description={post.description}
            list={list?.title}
            listId={listId}
            isPrivate={isPrivate}
          />
        </div>
      )}
    </div>
  );
}

export default PostItemListPage;
