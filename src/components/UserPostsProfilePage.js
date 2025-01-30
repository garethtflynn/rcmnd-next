"use client";
import React, { useEffect, useState } from "react";
import PostItemProfilePage from "./PostItemYourProfilePage";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
            // console.log("RES IN userTest", res);
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          console.log(data);
          setPosts(data);
        } catch (err) {
          console.log(err);
          // setError(err.message);
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

      // console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
      // You might want to show an error message to the user
    }
  };

  return (
    // <div>
    //   {posts?.length > 0 ? (
    //     <div className="min-h-fit w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center bg-[#110A02] text-[#FBF8F4] overflow-y-auto pb-2">
    //       {posts.map((post) => (
    //         <PostItemProfilePage
    //           key={post.id}
    //           title={post.title}
    //           href={`/post/${post.id}`}
    //           src={post.image}
    //           alt={post.title}
    //           list={post.list?.title}
    //           deletePostCallback={deletePost} // Pass deletePost function as a callback
    //           {...post}
    //         />
    //       ))}
    //     </div>
    //   ) : (
    //     <div className="text-[#FBF8F4] flex flex-col justify-center items-center h-full">
    //       <p>start rcmnding your favorite things</p>
    //       <Link href="/createPost">
    //         <button
    //           type="button"
    //           className="w-full mt-2 bg-[#ECE2D8] hover:opacity-75 text-[#110A02] py-2 px-4 duration-500 "
    //         >
    //           create post
    //         </button>
    //       </Link>
    //     </div>
    //   )}
    // </div>
    <div className="min-h-fit w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center bg-[#110A02] text-[#FBF8F4] overflow-y-auto pb-2">
      {posts?.map((post) => {
        return (
          <PostItemProfilePage
            key={post.id}
            title={post.title}
            href={`/post/${post.id}`}
            src={post.image}
            alt={post.title}
            list={post.list?.title}
            deletePostCallback={deletePost}
            {...post}
          />
        );
      })}
    </div>
  );
}

export default UserPosts;
