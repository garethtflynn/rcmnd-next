"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import PostItemDetailsPage from "@/components/PostItemDetailsPage";

function PostPage(props) {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/post/${postId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) {
            console.log("RES", res);
            throw new Error("Failed to fetch post");
          }
          const data = await res.json();
          console.log(data);
          setPost(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#110A02] text-[#FBF8F4]">
        <h2>loading...</h2>
      </div>
    );
  }

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
      setPost(post.filter((post) => post.id !== postId));

      console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <PostItemDetailsPage
      key={post.id}
      title={post.title}
      src={post.image}
      alt={post.title}
      deletePostCallback={deletePost} 
      {...post}
    />
  );
}

export default PostPage;
