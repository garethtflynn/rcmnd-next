"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

function UserLists(props) {
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
      <ul className="flex flex-row gap-32 md:gap-56 no-scrollbar bg-[#110A02] text-[#FBF8F4] text-xl overflow-x-auto">
        {lists?.map((list) => {
          return (
            <li
              key={list.id}
              onClick={() => handleListClick(list.id)}
              className="text-[#FBF8F4] p-2 cursor-pointer text-xl text-nowrap	"
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
