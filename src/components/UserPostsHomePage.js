"use client";
import React, { useEffect, useState } from "react";
import PostItemHomePage from "./PostItemHomePage";
import { useSession } from "next-auth/react";

const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a copy of the array to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

function UserPostsHomePage(props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [posts, setPosts] = useState(null);
  // const [postUser, setPostUser] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const followingRes = await fetch(`/api/user/${userId}/following`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!followingRes.ok) {
            throw new Error("Failed to fetch following users");
          }

          const followingData = await followingRes.json(); // This should return the list of users the logged-in user is following
          // console.log(followingData);
          // setPostUser(followingData.username)

          const followingIds = followingData.map((user) => user.id);

          const postsRes = await fetch(
            // `/api/posts?userIds=${followingIds.join(",")}`,
            `/api/posts?userIds=${followingIds}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          // console.log(postsRes)
          if (!postsRes.ok) {
            throw new Error("Failed to fetch posts from followed users");
          }

          const postsData = await postsRes.json();
          // console.log(postsData);

          // You can now shuffle and slice posts if you need
          const shuffledPosts = shuffleArray(postsData);
          setPosts(shuffledPosts.slice(0, 4));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#000000] text-[#D7CDBF]">
        <h2>loading...</h2>
      </div>
    );
  }
  return (
    <div className="md:min-h-screen min-w-full bg-[#000000] text-[#D7CDBF] grid grid-cols-2 md:grid-cols-3 md:content-center lg:grid-cols-4 gap-2 px-1">
      {posts?.map((post) => {
        return (
          <PostItemHomePage
            key={post.id}
            title={post.title}
            href={`/post/${post.id}`}
            src={post.image}
            alt={post.title}
            {...post}
          />
        );
      })}
    </div>
  );
}

export default UserPostsHomePage;
