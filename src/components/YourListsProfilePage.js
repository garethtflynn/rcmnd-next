"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaAngleDown } from "react-icons/fa";

function UserLists(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isListsOpen, setIsListsOpen] = useState(false);
  const [lists, setLists] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchLists = async () => {
        try {
          const res = await fetch(`/api/lists/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) {
            // console.log("RES IN userTest", res);
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          // console.log(data);
          setLists(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

  const handleListClick = (listId) => {
    // console.log("List ID:", listId);
    router.push(`/list/${listId}`); // Navigate to the list page
  };

  // if (isLoading) {
  //   return <div className="text-[#FBF8F4]">Loading lists...</div>;
  // }

  return (
    <div className="max-w-screen px-3">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[#000000] px-4 py-1 text-base font-semibold text-[#FBF8F4] shadow-sm ring-1 ring-inset ring-[#252220] hover:bg-[#252220] italic transition-colors duration-200">
          Lists
          <FaAngleDown className="self-center" color="#FBF8F4" />
        </MenuButton>

        <MenuItems className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded bg-[#000000] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {lists && lists.length > 0 ? (
              lists.map((list) => (
                <MenuItem key={list.id}>
                  {({ focus }) => (
                    <button
                      onClick={() => handleListClick(list.id)}
                      className={`${
                        focus ? "bg-gray-800 text-[#FBF8F4]" : "text-[#FBF8F4]"
                      } group flex w-full items-center px-4 py-3 text-lg font-semibold italic cursor-pointer text-left hover:bg-gray-800 transition-colors duration-150`}
                    >
                      {list.title}
                    </button>
                  )}
                </MenuItem>
              ))
            ) : (
              <div className="px-4 py-3 text-[#FBF8F4] text-lg italic">
                No lists found
              </div>
            )}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}

export default UserLists;
