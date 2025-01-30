"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import PostItemUserProfilePage from "@/components/PostItemUserProfilePage";
import UserListsProfilePage from "@/components/UserListsProfilePage";

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
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#110A02] text-[#FBF8F4]">
        <h2>loading...</h2>
      </div>
    );
  }

  const handleFollowToggle = async () => {
    const followerId = currentUserId;
    const followingId = userId;

    // console.log("CURRENT USER", followerId);
    // console.log("USER", followingId);

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
    <div className="h-screen bg-[#110A02] text-[#FBF8F4]">
      {user && (
        <div className="flex flex-col items-end text-[#FBF8F4] pr-1 lowercase">
          <p className="text-xl font-bold">{user.firstName}</p>
          <p className="text-xl font-bold">{user.lastName}</p>
          <p className="text-md">@{user.username}</p>
        </div>
      )}

      <div className="my-2 h-8 flex pl-1">
        {/* Follow Button */}
        <button
          onClick={handleFollowToggle}
          className={`w-1/3 py-2 flex justify-center items-center text-[#FBF8F4] ${
            isFollowing
              ? "bg-[#FBF8F4] border border-[#1E1912]"
              : "bg-[#1E1912] border border-[#FBF8F4]"
          }`}
        >
          <p className={`${isFollowing ? "text-[#1E1912]" : "text-[#FBF8F4]"}`}>
            {isFollowing ? "following" : "follow"}
          </p>
        </button>
      </div>
      <div>
        <UserListsProfilePage />
      </div>

      {/* {posts?.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center bg-[#110A02] text-[#FBF8F4] overflow-y-auto pb-2">
          {posts.map((post) => (
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
      ) : (
        <div className="text-[#FBF8F4] flex flex-col justify-center items-center h-full lowercase">
          <p>{user.firstName} has no posts</p>
        </div>
      )} */}

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center bg-[#110A02] text-[#FBF8F4] overflow-y-auto pb-2">
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
