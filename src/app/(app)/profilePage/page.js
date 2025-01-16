"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import UserPostsProfilePage from "@/components/UserPostsProfilePage";
import UserListsProfilePage from "@/components/UserListsProfilePage";

function ProfilePage(props) {
  const [feed, setFeed] = useState(true);
  const [postsStyle, setPostsStyle] = useState({ backgroundColor: "#513C2C" });
  const [listsStyle, setListsStyle] = useState({ backgroundColor: "#110A02" });

  // Function to show Posts and set styles accordingly
  const showPosts = () => {
    setFeed(true);
    setPostsStyle({ backgroundColor: "#513C2C" });
    setListsStyle({ backgroundColor: "#ECE2D8" });
  };

  const showLists = () => {
    setFeed(false);
    setPostsStyle({ backgroundColor: "#ECE2D8" });
    setListsStyle({ backgroundColor: "#513C2C" });
  };

  return (
    <div className="bg-[#110A02] text-[#FBF8F4] h-screen">
      <div className="w-full">
        <p className="place-self-center">profile picture</p>
      </div>

      <div className="flex justify-evenly h-10">
        <button
          className="hover:bg-[#513C2C] w-full duration-1000"
          onClick={showPosts}
          style={feed ? { ...postsStyle } : {}} // Apply Post style if feed is true
        >
          Posts
        </button>
        <button
          className="hover:bg-[#513C2C] w-full duration-1000"
          onClick={showLists}
          style={!feed ? { ...listsStyle } : {}} // Apply List style if feed is false
        >
          Lists
        </button>
      </div>

      <div>
        <div
          style={postsStyle}
          className={`${feed ? "block" : "hidden"} transition-all duration-500`}
        >
          <UserPostsProfilePage />
        </div>
        <div
          style={listsStyle}
          className={`${
            !feed ? "block" : "hidden"
          } transition-all duration-500`}
        >
          <UserListsProfilePage />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
