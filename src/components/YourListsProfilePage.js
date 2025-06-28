"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

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
    router.push(`/list/${listId}`);
    // Optionally close after selection
    // setIsListsOpen(false);
  };

  const handleToggle = () => {
    setIsListsOpen(!isListsOpen);
  };

  return (
    <>
      <div className="px-2 my-2">
        {/* <div
          className={`
            relative overflow-hidden transition-all duration-500 ease-in-out py-1
            ${isListsOpen ? "w-full" : "inline-block "}
          `}
        > */}
          {/* Button/Expanded Container */}
          <div
            className={`
              flex items-center transition-all duration-500 ease-in-out
              rounded-md bg-[#000000] shadow-sm ring-1 ring-inset ring-[#252220] 
              hover:bg-[#252220] cursor-pointer
              ${
                isListsOpen
                  ? "px-4 py-1 justify-start gap-4 overflow-x-auto no-scrollbar h-8"
                  : "px-4 py-1 justify-center gap-x-1.5 w-36 h-8"
              }
            `}
            onClick={!isListsOpen ? handleToggle : undefined}
          >
            {/* Lists Button (collapsed state) */}
            {!isListsOpen && (
              <>
                <button className="text-lg font-semibold text-[#FBF8F4] italic transition-colors duration-700">
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
                  className="flex-shrink-0 overflow-x-auto overflow-y-clip p-1 hover:bg-[#252220] rounded transition-colors duration-700"
                >
                  <FaAngleUp color="#FBF8F4" />
                </button>

                {/* Horizontal scrollable lists */}
                <div className="flex gap-6 overflow-x-auto no-scrollbar py-1 h-8">
                  <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar text-[#D7CDBF] text-lg overflow-x-auto">
                    {lists?.map((list) => {
                      return (
                        <button
                          key={list.id}
                          onClick={() => handleListClick(list.id)}
                          className="text-[#D7CDBF] cursor-pointer text-xl text-nowrap	self-center"
                        >
                          {list.title}
                        </button>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>
        {/* </div> */}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
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
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

export default UserLists;
