"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function UserLists(props) {
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

  return (
    <div className="max-w-screen px-3">
      <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar bg-[#000000] text-xl overflow-x-auto">
        {lists?.map((list) => {
          return (
            <li
              key={list.id}
              onClick={() => handleListClick(list.id)}
              className="text-[#4C4138] p-2 cursor-pointer text-nowrap	text-base italic"
            >
              {list.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserLists;
