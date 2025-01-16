"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { signOut } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import SearchBar from "./SearchBar";

export default function Header() {
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/welcome" });
      console.log("logged out!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex h-max bg-[#110A02]  duration-1000 p-5">
      <div className="text-white place-content-center">
        <a href="/homeFeed" className="font-semibold text-xl">
          rcmnd
        </a>
      </div>
      <SearchBar />
      <div className="w-auto flex-grow md:flex md:flex-end md:items-center lg:w-auto flex flex-end items-center ">
        <div className="w-full text-sm flex justify-end">
          <Link href="/profilePage" className="text-[#FBF8F4] px-3">
            profile
          </Link>
          <Menu
            as="div"
            className="relative inline-block text-left bg-transparent hover:text-[#ECE2D8] duration-1000"
          >
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-3 px-3 text-sm font-semibold">
                <FaPlus
                  aria-hidden="true"
                  color="#FBF8F4"
                  className="h-5 w-5"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-[#FBF8F4] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="/createPost"
                    className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200"
                  >
                    Post
                  </a>
                </MenuItem>
                <MenuItem className="block px-4 py-2 text-sm text-[#110A02] hover:bg-gray-200 close">
                  <Link href="/createList">List</Link>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          <Menu
            as="div"
            className="relative inline-block text-left bg-transparent hover:text-[#ECE2D8] duration-1000"
          >
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-3 px-3 text-sm font-semibold">
                <FaAngleDown
                  aria-hidden="true"
                  color="#FBF8F4"
                  className="h-5 w-5"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-[#FBF8F4] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-[#110A02] hover:bg-gray-200"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
