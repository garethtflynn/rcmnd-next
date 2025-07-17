"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";


import PostItemDetailsPage from "@/components/posts/PostItemDetailsPage";
import Loading from "@/components/common/Loading";

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
          // console.log(data);
          setPost(data);
          // console.log("postId page data", data);
        } catch (err) {
          console.log(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);
  
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
      
      // console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <PostItemDetailsPage
        key={post.id}
        title={post.title}
        src={post.image}
        alt={post.title}
        username={post.user.username}
        userId={post.userId}
        deletePostCallback={deletePost}
        {...post}
      />
    </div>
  );
}

export default PostPage;
