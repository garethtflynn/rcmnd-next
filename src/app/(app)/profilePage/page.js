"use client";
import React, { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { HiBars3 } from "react-icons/hi2";
import Link from "next/link";

import UserPostsProfilePage from "@/components/posts/UserPostsProfilePage";
import YourListsProfilePage from "@/components/lists/YourListsProfilePage";
import { Loading } from "@/components/common/";

function ProfilePage(props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isListsOpen, setIsListsOpen] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      fetch(`/api/user/${currentUserId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setUser(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user", error);
          setIsLoading(false);
        });
    }
  }, [currentUserId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-[#000000] text-[#D7CDBF] h-screen">
      {user && (
        <div className="flex flex-col items-end  pr-1 lowercase">
          <p className="text-xl font-bold text-[#FBF8F4]">{user.firstName}</p>
          <p className="text-xl font-bold text-[#FBF8F4]">{user.lastName}</p>
          <p className="text-sm font-light text-[#F1E9DA]">@{user.username}</p>
        </div>
      )}

      <div className="my-2 grid grid-cols-2 justify-between">
        <div className={isListsOpen ? "col-span-2" : ""}>
          <YourListsProfilePage
            isListsOpen={isListsOpen}
            setIsListsOpen={setIsListsOpen}
          />
        </div>
        {!isListsOpen && (
          <Menu as="div" className="justify-self-end self-center pr-1">
            <MenuButton>
              <HiBars3
                size={25}
                color="#FBF8F4"
                className="cursor-pointer"
              />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 w-40 z-30 origin-top-right bg-[#000000] transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-700 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem className="block px-4 py-2 text-sm text-[#F1E9DA] text-center font-semibold">
                  <Link href="/favorites" className="cursor-pointer flex items-center hover:opacity-25 duration-300">
                  <FaRegBookmark size={20} color="#F1E9DA" className="" />
                    <p className="pl-3">favorites</p>
                  </Link>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>
      <UserPostsProfilePage />
    </div>
  );
}

export default ProfilePage;
