import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { useSession } from "next-auth/react";

function UserPosts(props) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [posts, setPosts] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/posts/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!res.ok) {
            console.log("RES IN userTest", res);
            throw new Error("Failed to fetch posts");
          }
          const data = await res.json();
          console.log(data)
          setPosts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [userId]);

  return (
    <div className="h-full w-full py-1 px-4 grid grid-cols-3 bg-[#110A02] text-[#FBF8F4]">
      {posts?.map((post) => {
        return (
          <PostItem
            key={post.id}
            title={post.title}
            href={post.link}
            src={post.image}
            alt={post.title}
            {...post}
          />
        );
      })}
    </div>
  );
}

export default UserPosts;
