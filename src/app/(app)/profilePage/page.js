"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import UserPostsProfilePage from "@/components/UserPostsProfilePage";
import UserLists from "@/components/YourListsProfilePage";
import Loading from "@/components/Loading";

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
    return <Loading />;
  }

  return (
    <div className="bg-[#000000] text-[#D7CDBF] h-screen">
      {user && (
        <div className="flex flex-col items-end  pr-1 lowercase">
          <p className="text-xl font-bold text-[#FBF8F4]">{user.firstName}</p>
          <p className="text-xl font-bold text-[#FBF8F4]">{user.lastName}</p>
          <p className="text-sm font-light text-[#F1E9DA]">@{user.username}</p>
        </div>
      )}
      <div>
        <UserLists />
      </div>
        <UserPostsProfilePage />
    </div>
  );
}

export default ProfilePage;
