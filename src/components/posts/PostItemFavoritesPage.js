// components/PostItemFavoritesPage.js
"use client";
import React from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";

import { AppImage } from "@/components/common";

function PostItemFavoritesPage({ post }) {
  const router = useRouter();
  if (!post) return null;

  const handleRemoveFavorite = async () => {
    try {
      // Sending a DELETE request to the API
      const response = await fetch(`/api/post/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // If the API call is successful update the page 
      setPost(post.filter((post) => post.id !== post.id));

      // console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="bg-[#252220] rounded-lg p-6">
      {post.image && (
        <div className="relative mb-4">
          <AppImage
            src={post.image}
            alt={post.title || "Post image"}
            className="rounded-lg w-full h-full"
          />
          <Menu as="div" className="absolute top-2 right-2 z-10">
            <MenuButton className="text-[#D7CDBF] hover:text-white">
              <FaEllipsisVertical size={18} color="#252220" />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 mt-2 w-40 origin-top-right bg-[#000000] z-20 rounded-md border border-gray-700 focus:outline-none shadow-lg"
            >
              <div className="py-1">
                <MenuItem
                  onClick={handleRemoveFavorite}
                  className="block px-4 py-2 text-sm text-[#F1E9DA] font-semibold hover:opacity-50"
                >
                  <p>remove favorite</p>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      )}
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-medium">
            {post.user?.firstName?.[0] || post.user?.username?.[0] || "?"}
            </span>
            </div> */}
          {/* User Info */}
          <div>
            <h3 className="font-medium">
              {post.user?.firstName && post.user?.lastName
                ? `${post.user.firstName} ${post.user.lastName}`
                : post.user?.username || "Unknown User"}
            </h3>
            <p className="text-sm text-[#FBF8F4]/30">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        {post.title && (
          <h4 className="text-lg font-semibold break-words">{post.title}</h4>
        )}
        {post.description && (
          <p className="text-[#FBF8F4]/50 text-base break-words mb-2">
            {post.description}
          </p>
        )}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FBF8F4]/45 leading-relaxed break-words overflow-hidden"
          >
            link
          </a>
        )}
      </div>
    </div>
  );
}

export default PostItemFavoritesPage;
