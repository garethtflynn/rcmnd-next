"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function UserListsProfilePage({ isListsOpen, setIsListsOpen }) {
  const router = useRouter();
  const { userId } = useParams();

  const [lists, setLists] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // console.log(userId)
      const fetchLists = async () => {
        try {
          const res = await fetch(`/api/user/${userId}`, {
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
          setLists(data.lists);
        } catch (err) {
          // setError(err.message);
          console.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLists();
    }
  }, [userId]);

  const handleListClick = (listId) => {
    // console.log("List ID:", listId);
    router.push(`/list/${listId}`);
  };

  const handleToggle = () => {
    setIsListsOpen(!isListsOpen);
  };

  return (
    <>
      <div className="px-2">
        <div
          className={`
            flex items-center transition-all duration-500 ease-in-out
            rounded-md bg-[#000000] shadow-sm ring-1 ring-inset ring-[#252220] 
           cursor-pointer overflow-y-clip
            ${
              isListsOpen
                ? "px-4 py-1 justify-start gap-4 no-scrollbar h-8"
                : "px-4 py-1 justify-center gap-x-1.5 w-36 h-8"
            }
          `}
          onClick={!isListsOpen ? handleToggle : undefined}
        >
          {/* Lists Button (collapsed state) */}
          {!isListsOpen && (
            <>
              <button className="text-lg font-semibold text-[#FBF8F4] transition-colors duration-700 ">
                Lists
              </button>
              <FaAngleDown
                className="self-center transition-transform duration-300"
                color="#FBF8F4"
              />
            </>
          )}

          {/* Expanded Lists (expanded state) */}
          {isListsOpen && (
            <>
              {/* Close button */}
              <button
                onClick={handleToggle}
                className="flex-shrink-0 p-1 hover:bg-[#252220] rounded transition-colors duration-200"
              >
                <FaAngleUp color="#FBF8F4" />
              </button>

              {/* Horizontal scrollable lists */}
              <div className="flex gap-6 overflow-x-auto overflow-y-clip no-scrollbar py-1 h-8">
                {lists && lists.length > 0 ? (
                  <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar text-[#D7CDBF] text-lg">
                    {lists.map((list) => {
                      return (
                        <button
                          key={list.id}
                          onClick={() => handleListClick(list.id)}
                          className="text-[#D7CDBF] cursor-pointer text-xl text-nowrap hover:text-[#FBF8F4] transition-colors duration-200 self-center"
                        >
                          {list.title}
                        </button>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-[#FBF8F4] text-lg italic opacity-70">
                    {isLoading ? "Loading lists..." : "No lists found"}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      {/* <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style> */}
    </>
  );
}

export default UserListsProfilePage;
