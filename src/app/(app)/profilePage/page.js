"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import UserPosts from "@/components/UserPosts";
import UserLists from "@/components/UserListsProfilePage";

function ProfilePage(props) {
  const [feed, setFeed] = useState(true);
  // const [posts, setPosts] = useState([]);

  const showLists = () => {
    setFeed(false);
  };

  const showPosts = () => {
    setFeed(true);
  };

  return (
    <div className="bg-[#110A02] text-[#FBF8F4]">
      <Header />
      <div className="h-screen w-full flex flex-col items-center">
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
    </div>
  );
}

export default ProfilePage;
