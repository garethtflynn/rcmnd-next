"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Get dynamic params in App Router

import PostItem from "@/components/PostItemUserProfilePage";

function ListPage() {
  const { listId } = useParams();
  const [list, setList] = useState();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (listId) {
      fetch(`/api/list/${listId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            // If no posts, show a message
            setError("No posts found in this list.");
            setPosts([]); // Set empty posts array
            setIsLoading(false);
            return;
          }
          console.log(data)
          setList(data[0].list);
          setPosts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch posts", error);
          setIsLoading(false);
        });
    }
  }, [listId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#110A02] text-[#FBF8F4]">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#110A02]">
      <div className="text-[#FBF8F4] py-4 px-6 flex justify-center">
        {list && <h1 className="text-2xl font-bold">{list.title}</h1>}
      </div>
      {posts?.length > 0 ? (
        <div className="w-full py-1 px-4 gap-4 grid grid-cols-2 md:grid-cols-3 text-[#FBF8F4]">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              title={post.title}
              src={post.image}
              alt={post.title}
              {...post}
            />
          ))}
        </div>
      ) : (
        <div className="text-[#FBF8F4] flex justify-center items-center h-full">
          <p>No posts in this list!</p>
        </div>
      )}
    </div>
  );
}

export default ListPage;
