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
            console.log("RES IN userTest", res);
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          console.log(data);
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
    router.push(`/list/${listId}`); // Navigate to the list page
  };
  return (
    <div className="w-full h-screen bg-[#110A02] text-[#FBF8F4] grid grid-cols-2 md:grid-cols-3 gap-2 px-2">
      {lists?.map((list) => {
        return (
          <div
            key={list.id}
            className='place-content-center'
          >
            <p
              onClick={() => handleListClick(list.id)}
              className="text-[#FBF8F4] text-base p-2 cursor-pointer border w-full hover:bg-[#513C2C] text-center active:italic"
            >
              {list.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default UserLists;
