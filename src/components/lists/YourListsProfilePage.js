"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaAngleDown, FaAngleUp, FaPlus } from "react-icons/fa";
import Link from "next/link";

function YourListsProfilePage({ isListsOpen, setIsListsOpen }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
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
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
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
    // console.log('LIST ID', listId)
    router.push(`/list/${listId}`);
    // setIsListsOpen(false);
  };

  const handleToggle = () => {
    setIsListsOpen(!isListsOpen);
  };

  if (!isLoading && (!lists || lists.length === 0)) {
    return (
      <div className="px-2 my-2">
        <div className="flex items-center justify-center px-4 py-1 w-36 h-8 rounded-md bg-[#000000] shadow-sm ring-1 ring-inset ring-[#252220]">
          <Link
            href="/createList"
            className="flex items-center gap-2 text-[#FBF8F4] hover:text-[#D7CDBF] transition-colors duration-300 text-lg font-semibold"
          >
            <FaPlus size={15} />
            create list
          </Link>
        </div>
      </div>
    );
  }

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

          {isListsOpen && (
            <>
              <button
                onClick={handleToggle}
                className="flex-shrink-0 p-1 hover:bg-[#252220] rounded transition-colors duration-200"
              >
                <FaAngleUp color="#FBF8F4" />
              </button>

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
    </>
  );
}

export default YourListsProfilePage;
