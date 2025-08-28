"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import PostItemHomePage from "@/components/posts/PostItemHomePage";
import Loading from "@/components/common/Loading";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function HomeFeed(props) {
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

          const followingData = await followingRes.json();
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

          const shuffledPosts = shuffleArray(postsData);
          setPosts(shuffledPosts.slice(0, 6));
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
    return <Loading />;
  }


  return (
    <div className="md:min-h-screen bg-[#000000] text-[#D7CDBF] grid grid-cols-2 md:grid-cols-3 md:content-center gap-2 gap-y-6 mx-1">
      {!posts || posts.length === 0 ? (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#000000] text-[#D7CDBF]">
          <h3 className="text-xl mb-2">you`re not following anyone yet</h3>
          <p className="text-gray-400 mb-6">
            search for and follow users to curate your home feed
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostItemHomePage
            key={post.id}
            title={post.title}
            href={`/post/${post.id}`}
            image={post.image}
            username={post.user?.username}
            userId={post.userId}
            alt={post.title}
          />
        ))
      )}
    </div>
  );
}
