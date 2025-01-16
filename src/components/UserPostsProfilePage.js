"use client";
import React, { useEffect, useState } from "react";
import PostItemProfilePage from "./PostItemYourProfilePage";
import { useSession } from "next-auth/react";

// const shuffleArray = (array) => {
//   const shuffled = [...array]; // Create a copy of the array to avoid mutating the original
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
//   }
//   return shuffled;
// };

function UserPosts(props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [posts, setPosts] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/posts/${userId}`, {
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
          setPosts(data);
          // const shuffledPosts = shuffleArray(data);
          // setPosts(shuffledPosts.slice(0, 4));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [userId]);

  const deletePost = async (postId) => {
    try {
      // Sending a DELETE request to the API
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // If the API call is successful, update the UI (remove the post from the state)
      setPosts(posts.filter((post) => post.id !== postId));

      console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
      // You might want to show an error message to the user
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-1 justify-center items-center bg-[#110A02] text-[#FBF8F4] overflow-y-auto">
      {posts?.map((post) => {
        return (
          <PostItemProfilePage
            key={post.id}
            title={post.title}
            href={post.link}
            src={post.image}
            alt={post.title}
            deletePostCallback={deletePost} // Pass deletePost function as a callback
            {...post}
          />
        );
      })}
    </div>
  );
}

export default UserPosts;
