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
      <div className="max-w-screen px-3">
        <div
          className={`
            relative overflow-hidden transition-all duration-500 ease-in-out
            ${isListsOpen ? "w-full" : "inline-block"}
          `}
        >
          {/* Button/Expanded Container */}
          <div
            className={`
              flex items-center transition-all duration-500 ease-in-out
              rounded-md bg-[#000000] shadow-sm ring-1 ring-inset ring-[#252220] 
              hover:bg-[#252220] cursor-pointer
              ${
                isListsOpen
                  ? "px-4 py-1 justify-start gap-4 overflow-x-auto no-scrollbar"
                  : "px-4 py-1 justify-center gap-x-1.5"
              }
            `}
            onClick={!isListsOpen ? handleToggle : undefined}
          >
            {/* Lists Button (collapsed state) */}
            {!isListsOpen && (
              <>
                <button className="text-lg font-semibold text-[#FBF8F4] italic transition-colors duration-700 w-36">
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
                  className="flex-shrink-0 p-1 hover:bg-[#252220] rounded transition-colors duration-700"
                >
                  <FaAngleUp color="#FBF8F4" />
                </button>

                {/* Horizontal scrollable lists */}
                <div className="flex gap-6 overflow-x-auto no-scrollbar py-1">
                  <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar text-[#D7CDBF] text-lg overflow-x-auto">
                    {lists?.map((list) => {
                      return (
                        <button
                          key={list.id}
                          onClick={() => handleListClick(list.id)}
                          className="text-[#D7CDBF] cursor-pointer text-xl text-nowrap	"
                        >
                          {list.title}
                        </button>
                      );
                    })}
                  </ul>

                  {/* {lists && lists.length > 0 ? (
                    lists.map((list, index) => (
                      <button
                        key={list.id}
                        onClick={() => handleListClick(list.id)}
                        className={`
                          flex-shrink-0 px-4 py-2 text-[#FBF8F4] text-base italic
                          hover:bg-[#252220] rounded transition-all duration-200
                          transform hover:scale-105 cursor-pointer text-nowrap
                          opacity-0 animate-fade-in
                        `}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        {list.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-[#FBF8F4] text-lg italic opacity-70">
                      {isLoading ? "Loading lists..." : "No lists found"}
                    </div>
                  )} */}
                </div>
              </>
            )}
          </div>
        </div>
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
