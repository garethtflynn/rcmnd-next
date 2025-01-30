"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const User = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  console.log("Session Log in userTest:", session);

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

  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (status === "loading") {
    return <div>loading...</div>; // Show loading state while session is loading
  }

  if (!session) {
    return <div>You are not logged in.</div>; // Handle case where session is not available
  }
  console.log("session log in userTest.js", session);

  if (status === "loading") {
    return <div>loading...</div>; // Show loading state while session is loading
  }

  if (!session) {
    return <div>You are not logged in.</div>; // Handle case where session is not available
  }
  console.log("session log in userTest.js", session);

  return (
    <div>
      <h1>Hello, {session.user.name}</h1>
      <h1>userId is: {userId}</h1>
      <pre>{JSON.stringify(session)}</pre>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};
