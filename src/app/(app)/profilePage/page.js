"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import UserPostsProfilePage from "@/components/UserPostsProfilePage";
import UserLists from "@/components/YourListsProfilePage";

function ProfilePage(props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetch(`/api/user/${currentUserId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setUser(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user", error);
          setIsLoading(false);
        });
    }
  }, [currentUserId]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#110A02] text-[#FBF8F4]">
        <h2>loading...</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#110A02] text-[#FBF8F4] h-screen">
      {user && (
        <div className="flex flex-col items-end text-[#FBF8F4] pr-1 lowercase">
          <p className="text-xl font-bold">{user.firstName}</p>
          <p className="text-xl font-bold">{user.lastName}</p>
          <p className="text-sm font-light">@{user.username}</p>
        </div>
      )}
      <div className="pt-4 pb-3">
        <UserLists />
      </div>
      <UserPostsProfilePage />
    </div>
  );
}

export default ProfilePage;
