"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@headlessui/react";
import { FaUserPlus, FaUserCheck } from "react-icons/fa6";

import PostItemUserProfilePage from "@/components/PostItemUserProfilePage";
import UserListsProfilePage from "@/components/UserListsProfilePage";
import Loading from "@/components/Loading";

function UserPage(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [lists, setLists] = useState();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (currentUserId && userId) {
      fetch(`/api/user/${currentUserId}/following`)
        .then((res) => res.json())
        .then((data) => {
          const isUserFollowing = data.some(
            (followedUser) => followedUser.id === userId
          );
          setIsFollowing(isUserFollowing); // Set follow status
        })
        .catch((error) =>
          console.error("Error checking follow status:", error)
        );
    }
  });

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
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
    return <Loading />;
  }

  const handleFollowToggle = async () => {
    const followerId = currentUserId;
    const followingId = userId;

    try {
      const method = isFollowing ? "DELETE" : "POST"; // Toggle between DELETE and POST
      const url = isFollowing ? "/api/unfollow" : "/api/follow"; // Toggle between unfollow and follow endpoints

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId, followingId }),
      });
      const data = await response.json();

      if (response.ok) {
        if (isFollowing) {
          console.log("Unfollow action successful:", data.message);
          setIsFollowing(false); // Mark as not following
        } else {
          console.log("Follow action successful:", data.message);
          setIsFollowing(true); // Mark as following
        }
      } else {
        console.error(
          `${isFollowing ? "Unfollow" : "Follow"} action failed:`,
          data.error
        );
      }
    } catch (error) {
      console.error(
        `${isFollowing ? "Unfollow" : "Follow"} action failed:`,
        error
      );
    }
  };

  return (
    <div className="h-screen bg-[#000000] text-[#D7CDBF]">
      {user && (
        <div className="flex flex-col items-end text-[#D7CDBF] pr-1 lowercase">
          <p className="text-xl font-bold">{user.firstName}</p>
          <p className="text-xl font-bold">{user.lastName}</p>
          <p className="text-md">@{user.username}</p>
        </div>
      )}

      <div className="my-2 h-8 flex justify-between pl-1">
        <UserListsProfilePage />
        {/* Follow Button */}
        <Button
          onClick={handleFollowToggle}
          className={`inline-flex items-center justify-center gap-x-2 rounded-md px-4 py-1 text-base font-semibold shadow-sm ring-1 ring-inset italic transition-all duration-200 mr-1 ${
            isFollowing
              ? "bg-[#252220] text-[#FBF8F4] ring-[#252220] hover:bg-[#1a1816] hover:ring-[#1a1816]"
              : "bg-[#000000] text-[#FBF8F4] ring-[#252220] hover:bg-[#252220] hover:ring-[#252220]"
          }`}
        >
          {isFollowing ? (
            <>
              <FaUserCheck className="w-3 h-3" />
              following
            </>
          ) : (
            <>
              <FaUserPlus className="w-3 h-3" />
              follow
            </>
          )}
        </Button>
      </div>
      <div></div>

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center bg-[#000000] text-[#D7CDBF] overflow-y-auto pb-2">
        {posts?.map((post) => (
          <PostItemUserProfilePage
            key={post.id}
            title={post.title}
            href={`/post/${post.id}`}
            src={post.image}
            alt={post.title}
            {...post}
          />
        ))}
      </div>
    </div>
  );
}

export default UserPage;
