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
    console.log("List ID:", listId); 
    router.push(`/list/${listId}`); // Navigate to the list page
  };
  
  return (
    <div className="logos">
      <div className="scroll scroll-smooth no-scrollbar bg-[#110A02] text-[#FBF8F4] logos-slide text-xl">
        {lists?.map((list) => {
          return (
            <p
              key={list.id}
              onClick={() => handleListClick(list.id)}
              className="text-[#FBF8F4] w-60  inline-block p-2 cursor-pointer text-xl"
            >
              {list.title}
            </p>
          );
        })}
      </div>
      <div className="scroll scroll-smooth no-scrollbar bg-[#110A02] text-[#FBF8F4] logos-slide ">
        {lists?.map((list) => (
          <p
            key={`duplicate-${list.id}`}
            onClick={() => handleListClick(list.id)}
            className="text-[#FBF8F4] w-60 inline-block p-2 cursor-pointer text-xl"
          >
            {list.title}
          </p>
        ))}
      </div>
    </div>
  );
}

export default UserLists;
