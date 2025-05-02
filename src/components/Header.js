"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import rcmndLogo from "../../public/rcmndLogo.png";
import SearchBar from "./SearchBar";
import Image from "next/image";

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
    <nav className="w-full flex h-max bg-[#000000] duration-1000 py-4">
      <div className="text-[#FBF8F4] place-content-center pl-2">
        <a href="/homeFeed" className="font-semibold text-2xl md:text-3xl">
          rcmnd
        </a>
      </div>
      <SearchBar />
      <div className="w-auto flex-grow lg:w-auto flex flex-end items-center">
        <div className="w-full text-sm flex justify-end items-center">
          <Menu
            as="div"
            className="relative inline-block text-left bg-transparent duration-1000"
          >
            <MenuButton className="full flex justify-center items-center pr-2">
              <Image
                src={rcmndLogo}
                alt="rcmnd"
                height={20}
                width={20}
                className="w-full"
              />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-3 w-40 origin-top-right bg-[#131110] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem>
                <Link
                  href="/createPost"
                  className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25"
                >
                  create post
                </Link>
              </MenuItem>
              <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] hover:opacity-25">
                <Link href="/createList">create list</Link>
              </MenuItem>
              <MenuItem>
                <Link
                  href="/profilePage"
                  className="block w-full px-4 py-2 text-left text-sm text-[#F1E9DA] hover:opacity-25"
                >
                  profile
                </Link>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-[#F1E9DA] font- hover:opacity-25"
                >
                  sign out
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
          <Menu
            as="div"
            className="relative inline-block text-left bg-transparent hover:text-[#FBF8F4] duration-1000"
          ></Menu>
        </div>
      </div>
    </nav>
  );
}
