"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UserPosts from "@/components/UserPosts";
import UserLists from "@/components/UserLists";

function ProfilePage(props) {
  const [feed, setFeed] = useState(true);
  const [posts, setPosts] = useState([]);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const showLists = () => {
    setFeed(false);
  };

  const showPosts = () => {
    setFeed(true);
  };

  // useEffect(() => {
  //   if (userId) {
  //     const fetchPosts = async () => {
  //       try {
  //         const res = await fetch(`/api/posts/${userId}`, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           credentials: "include",
  //         });
  //         if (!res.ok) {
  //           console.log("RES IN userTest", res);
  //           throw new Error("Failed to fetch posts");
  //         }
  //         const data = await res.json();
  //         setPosts(data);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchPosts();
  //   }
  // }, [userId]);

  return (
    <div className="bg-[#110A02] text-[#FBF8F4]">
      <Header />
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <p>profile picture</p>
        <div className="grid grid-cols-2 w-screen duration-1000">
          <button
            className="hover:bg-[#513C2C] w-max place-self-center"
            onClick={showPosts}
          >
            Posts
          </button>
          <button
            className="hover:bg-[#513C2C] w-max duration-1000 place-self-center"
            onClick={showLists}
          >
            Lists
          </button>
        </div>
        {feed ? <UserPosts /> : <UserLists />}
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
