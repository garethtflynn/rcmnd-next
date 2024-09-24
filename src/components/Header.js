"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { signOut } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function Header() {
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/welcome" });
      console.log("logged out!")
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex items-center flex-wrap bg-[#ECE2D8] hover:bg-[#110A02] duration-1000 p-4">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <a href="/homeFeed" className="font-semibold text-xl tracking-tight">
          rcmnd
        </a>
        <input
          type="text"
          name="email"
          placeholder="search"
          className="border border-[#ECE2D8] bg-transparent text-[#ECE2D8] px-2 py-1 my-1 ml-4 rounded hover:bg-[#513C2C] focus:within:bg-[#ECE2D8] outline-none placeholder-[#513C2C]"
        />
      </div>
      <div className="w-full block flex-grow lg:flex lg:flex-end lg:items-center lg:w-auto">
        <div className="w-full text-sm flex items-center justify-end">
          <Menu
            as="div"
            className="relative inline-block text-left bg-transparent hover:text-[#ECE2D8] duration-1000"
          >
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold">
                Options
                <FaAngleDown aria-hidden="true" className="-mr-1 h-5 w-5" />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Account settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Support
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    License
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
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
