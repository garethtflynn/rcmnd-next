"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import PostItemUserProfilePage from "@/components/PostItemUserProfilePage";
import ListItem from "@/components/ListItem";

function UserPage(props) {
  const router = useRouter();
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [lists, setLists] = useState();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUser(data);
          setPosts(data.posts);
          setLists(data.lists);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user", error);
          setIsLoading(false);
        });
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#110A02] text-[#FBF8F4]">
        <h2>Loading...</h2>
      </div>
    );
  }

  const handleListClick = async (listId) => {
    router.push(`/list/${listId}`); // Navigate to the list page
  };

  return (
    <div className="h-screen bg-[#110A02] text-[#FBF8F4]">
      {user && (
        <div className="flex justify-center items-center text-white">
          <h1 className="text-2xl font-bold">
            {user.firstName + " " + user.lastName}
          </h1>
        </div>
      )}
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
      <div
        className={`${
          feed ? "block" : "hidden"
        } transition-all duration-500 w-full h-full  py-2 px-4 gap-3 text-[#FBF8F4] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 `}
      >
        {posts?.map((post) => (
          <PostItemUserProfilePage
            key={post.id}
            title={post.title}
            href={post.link}
            src={post.image}
            alt={post.title}
            {...post}
          />
        ))}
      </div>
      <div
        className={`${
          !feed ? "block" : "hidden"
        } transition-all duration-500 bg-[#110A02] text-[#FBF8F4] grid grid-cols-2 md:grid-cols-3 gap-2 px-2 h-full place-content-evenly`}
      >
        {lists?.map((list) => (
          <ListItem
            key={list.id}
            title={list.title}
            navToListCallback={handleListClick}
            {...list}
          />
        ))}
      </div>
    </div>
  );
}

export default UserPage;
